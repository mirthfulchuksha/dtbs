angular.module('DTBS.main')

.directive('d3Bars', ['d3Service', 'd3UpdateTable', 'd3Data', function (d3Service, d3UpdateTable, d3Data) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // Constants for the SVG
        var width = 640, height = 350;

        // Global array to track table classes for deletion
        scope.schemas = [];

        // Global object to track items within the layout
        var graph = {nodes: [], links: []};

        // Grouping variable for table clusters
        var groupNumber = 0;

        // Function to format incoming data into nodes and links
        var dataBuilder = function (data) {
          // Creates the larger table node
          var centralNode = {
            name: data.name,
            group: groupNumber++,
            size: 32,
            id: data.id
          };
          graph.nodes.push(centralNode);

          // Index of where to place the field nodes for the table
          var fieldCounter = graph.nodes.length-1;
          data.attrs.forEach(function (field) {
            // Slot the field in the next node position
            fieldCounter++;
            // Build up the node
            var fieldNode = {
              name: field.id,
              group: groupNumber,
              size: 16,
              id: data.id
            };

            graph.nodes.push(fieldNode);
            // Create the child links for the table
              var fieldToTableLink = {"source": 0, "target": fieldCounter, "value": 40};
            graph.links.push(fieldToTableLink);
          });
        };

        // Create the SVG
        var svg = d3.select(element[0])
        .append("svg")
        .style('width', '100%')
        .style('height', height);
        
        // Set up the colour scale
        var color = d3.scale.category20();
        //Set up the force layout
        var force = d3.layout.force()
            .charge(-500)
            //.linkDistance(80)
            .linkDistance(function(d) { return  d.value/2; }) 
            .size([width, height]);
       
        scope.render = function (tableData, tableExists) {
          // if the table already exists, delete that table from the graph
          if (tableExists) {
            // Reset graph
          }

          dataBuilder(tableData);
          var svg = d3.select("svg");

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
              .attr("class", tableData.name)
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
                .text(function(d) { return d.name });

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
        scope.$on('d3:update-table', function (e, data) {
          // when new data comes in, check array of all the table names
          // if new table (i.e. table is not in the array), draw new table
          if (scope.schemas.indexOf(data.name) === -1) {
            // push table onto schemas array
            scope.schemas.push(data.name);
            // pass false, data into render function
            scope.render(data, false);
          } else {
            // if existing table (name is already in the array), delete then re-draw that table
            // pass true, data
            scope.render(data, true);
          }
        });
        scope.$on('d3:delete-table', function (e, data) {
          d3.selectAll(data).remove();
        });
        scope.$on('d3:new-data', function (e, data) {
          // re do force layout with new data
          scope.render(data);
        });
      });
    }};
}]);



