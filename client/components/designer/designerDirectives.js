angular.module('DTBS.main')

.directive('d3Bars', ['d3Service', 'd3UpdateTable', function (d3Service, d3UpdateTable) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {

        var dummyData = {
          "nodes":[
            {"name": "Users", "group": 1},
            {"name": "id", "group": 1},
            {"name": "name", "group": 1},
            {"name": "subject_id", "group": 2},
            {"name": "Subjects", "group": 2},
            {"name": "id", "group": 2},
            {"name": "name", "group": 2},
            {"name": "teacher", "group": 2}
            ],
          "links": [
            {"source": 0, "target": 1, "value": 40},
            {"source": 0, "target": 2, "value": 40},
            {"source": 0, "target": 3, "value": 40},
            {"source": 4, "target": 5, "value": 40},
            {"source": 4, "target": 6, "value": 40},
            {"source": 4, "target": 7, "value": 40},
            {"source": 0, "target": 4, "value": 150}
            ]
        }
        // Constants for the SVG
        var width = 640,
        height = 350;
        // Array to track tables on the current design
        scope.schemaIds = [];

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
            .linkDistance(function(d) { return  d.value; }) 
            .size([width, height]);

        
        
        scope.render = function (tableData, tableExists) {
          // if the table already exists, delete that table
          if (tableExists) {
            d3.select("#tableID"+tableData.id).remove();
          }

          var graph = dummyData;
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

          //Do the same with the circles for the nodes - no 
          //Changed
          var node = svg.selectAll(".node")
              .data(graph.nodes)
              .enter().append("g")
              .attr("class", "node")
              .call(force.drag);

          node.append("circle")
              .attr("r", 8)
              .style("fill", function (d) {
              return color(d.group);
          })

          node.append("text")
                .attr("dx", 10)
                .attr("dy", ".35em")
                .text(function(d) { return d.name });
          //End changed


          //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
          force.on("tick", function () {
              link.attr("x1", function (d) {
                  return d.source.x;
              })
                  .attr("y1", function (d) {
                  return d.source.y;
              })
                  .attr("x2", function (d) {
                  return d.target.x;
              })
                  .attr("y2", function (d) {
                  return d.target.y;
              });

              //Changed
              
              d3.selectAll("circle").attr("cx", function (d) {
                  return d.x;
              })
                  .attr("cy", function (d) {
                  return d.y;
              });

              d3.selectAll("text").attr("x", function (d) {
                  return d.x;
              })
                  .attr("y", function (d) {
                  return d.y;
              });
              
              //End Changed

          });

        };

        scope.$on('d3:update-table', function (e, data) {
          // when new data comes in, check array of all the table ids
          // if new table (i.e. id is not in the array), draw new table
          if (scope.schemaIds.indexOf(data.id) === -1) {
            // push id onto ids array
            scope.schemaIds.push(data.id);
            // pass false, data into render function
            scope.render(data, false);
          } else {
            // if existing table (id is already in the array), delete then re-draw that table
            // pass true, data
            scope.render(data, true);
          }
        });
        scope.$on('d3:delete-table', function (e, data) {
          d3.select("#tableID"+data).remove();
        });
      });
    }};
}]);



