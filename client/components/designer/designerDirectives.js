angular.module('DTBS.main')

.directive('d3Bars', ['d3Service', 'd3TableClass', 'd3Data', 'd3Save', function (d3Service, d3TableClass, d3Data, d3Save) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // Constants for the SVG
        var width = 640, height = 350;

        var buildCentralNode = function (table, groupNumber) {
          var centralNode = {
            name: table.name,
            type: "title",
            pk: table.primaryKey,
            group: groupNumber,
            size: 32,
            id: table.id
          };
          return centralNode;
        };
        var buildFieldNode = function (table, field, groupNumber) {
          var fieldNode = {
            name: field.id,
            type: "field",
            origin: field.origin,
            group: groupNumber,
            size: 16,
            id: table.id
          };
          return fieldNode;
        };

        // function to transform data into dummyData format
        var dataBuilder = function (data) {
          // initialize empty graph
          var graph = {nodes: [], links: []};
          // build up primary key field indices for linking reference
          var primaryKeys = [];
          // build up foreign key indexes
          var foreignKeys = [];
          // initialize group number
          var groupNumber = 1;
          // loop through tables
          for (var i = 0; i < data.length; i++) {
            var table = data[i];
            // build up the central table node
            var centralNode = buildCentralNode(table, groupNumber);
            // push the central node onto the graph
            graph.nodes.push(centralNode);
              //[tableid: index]
            primaryKeys.push([table.id, graph.nodes.length-1]);
            var currentLength = graph.nodes.length-1;
            var fieldCounter = i;
            // loop through the current table's fields
            for (var j = 0; j < table.attrs.length; j++) {
              var field = table.attrs[j];
              fieldCounter++;
              var fieldNode = buildFieldNode(table, field, groupNumber);
              // push the field node onto the graph
              graph.nodes.push(fieldNode);
              // push the table/field link onto the graph
              var fieldToTableLink = {"source": currentLength, "target": graph.nodes.length-1, "value": 40};
              graph.links.push(fieldToTableLink);
              // if the field has an origin property, then it must be a FK linked to a PK field
              if (field.origin) {
                // we want to store the current index to check after all tables have been parsed
                // [fieldname: index]
                foreignKeys.push([field.id.toString()+":"+(graph.nodes.length-1).toString(), (graph.nodes.length-1).toString()]);
              }
            }
            groupNumber++; 
          }
          var container = {};
          container.graph = graph;
          container.primaryKeys = primaryKeys;
          container.foreignKeys = foreignKeys;
          return container;
        };
        var fkLinks = function (graphContainer, data) {
          var primaryKeys = graphContainer.primaryKeys;
          var foreignKeys = graphContainer.foreignKeys;
          var graph = graphContainer.graph;
          data.forEach(function (table) {
            table.attrs.forEach(function (field) {
              var source, target;
              // if it has a defined origin, it is a foreign key to a primary key in another table
              if (field.origin !== undefined) {
                // find the index in nodes of the primary key for that table id
                primaryKeys.forEach(function (pk) {
                  if (pk[0] === parseInt(field.origin)) {
                    source = parseInt(pk[1] + 1);
                    return;
                  }
                });
                // find the index in nodes of the foreign key for that field
                var counter = 0;
                foreignKeys.forEach(function (fk) {
                  // [fieldname: index]
                  if (field.id.toString()+":"+(fk[1]).toString() === fk[0]) {
                    target = parseInt(fk[1]);
                    foreignKeys.splice(counter,1);
                    counter++;
                    return;
                  }
                });
                var fieldToFKLink = {"source": source, "target": target, "value": 40};
                if (fieldToFKLink.source !== undefined && fieldToFKLink.target !== undefined) {
                  graph.links.push(fieldToFKLink);
                }
              }
            });
          });
          return graph;
        };

        // Create the SVG
        var svg = d3.select(element[0])
        .append("svg")
        .attr('id', '#canvas')
        .style('width', '100%')
        .style('height', height);
       
        scope.render = function (tableData) {
          // Global array to track table classes for deletion
          scope.schemas = [];

          // Set up the colour scale
          var color = d3.scale.category20();
          //Set up the force layout
          var force = d3.layout.force()
            .charge(-500)
            //.linkDistance(80)
            .linkDistance(function(d) { return  d.value/2; }) 
            .size([width, height]);

          var container = dataBuilder(tableData);
          var graph = fkLinks(container, tableData);
          
          var svg = d3.select("svg");
          console.log(graph, "correct format");
          // console.log(graph2, "inccorrect format");
          //Creates the graph data structure out of the json data
          force.nodes(graph.nodes)
              .links(graph.links)
              .start();

          //Create all the line svgs but without locations yet
          var link = svg.selectAll(".link")
              .data(graph.links)
              .enter().append("line")
              .attr("class", "link");

          var node = svg.selectAll(".node")
              .data(graph.nodes)
              .enter().append("g")
              .attr("class", "node")
              .attr("class", function (d) { return d.group; })
              .on("click", function () {
                click(this);
              })
              .on("dblclick", dblclick)
              .call(force.drag);

          // append the node
          node.append("circle")
              .attr("r", function (d) { return d.size/2; })
              .style("fill", function (d) {
              return color(d.group);
          })
          // append the field/table name
          node.append("text")
                .attr("dx", 10)
                .attr("dy", ".35em")
                .text(function (d) { return d.name })
                .attr("font-weight", function (d) { return d.type === "title" ? "bold" : "normal"; });

          //Give the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
          force.on("tick", function () {
            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            d3.selectAll("circle").attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });

            d3.selectAll("text").attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });
          });
        };
        
        var click = function (node) {
          // get the class name
          var className = $(node).attr('class');
          var classToSend = angular.copy(className);
          d3TableClass.push(classToSend);
        };
        var dblclick = function (d) {
          d3.select(this).classed("fixed", d.fixed = !d.fixed);
        };
        scope.$on('d3:new-data', function (e, data) {
          // re do force layout with new data
          var dataArr = [];
          for (var key in data) {
            dataArr.push(data[key]);
          }
          svg.selectAll("*").remove();
          scope.render(dataArr);
        });
        scope.$on('d3:save-table', function (e, data) {
          console.log("request to save!");
        });
      });
    }};
}]);



