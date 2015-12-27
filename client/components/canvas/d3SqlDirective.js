angular.module('DTBS.main')

.directive('d3Sql', [
   'd3Service',
   'canvasData',
   'canvasFormat',
   function (d3Service, canvasData, canvasFormat) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // Positioning constants for the layout
        var width = 1000, height = 450;

        // Create the SVG
        var svg = d3.selectAll("#designer");
       
        scope.render = function (tableData) {

          // Set up the custom colour scale
          var colorLength = 75, colors = [];
          var color = d3.scale.linear().domain([1,colorLength])
                .interpolate(d3.interpolateHcl)
                .range([d3.rgb("#007bff"), d3.rgb('#ffa543')]);

          tableData.forEach(function (table) {
            var tableColor = Math.floor(Math.random() * colorLength + 1);
            colors.push(tableColor);
          });


          //Set up the force layout
          var force = d3.layout.force()
            .charge(-500)
            //.linkDistance(80)
            .linkDistance(function(d) { return  d.value; }) 
            .size([width, height]);

          var container = canvasFormat.dataBuilder(tableData, true);
          var graph = canvasFormat.fkLinks(container, tableData);
          
          var svg = d3.select("#designer");
          //Creates the graph data structure out of the json data
          force.nodes(graph.nodes)
              .links(graph.links)
              .start();

          force.charge(function(node) {
            return -300;
          });

          //Create all the line svgs but without locations yet
          var link = svg.selectAll(".link")
              .data(graph.links)
              .enter().append("line")
              .style("stroke", "grey")
              .style("stroke-dasharray", function (d) {
                if (d.value === 160) {
                  return ("3, 3")
                } else {
                  return;
                }
              })
              .attr("class", "link");

          var node = svg.selectAll(".node")
              .data(graph.nodes)
              .enter().append("g")
              .attr("class", "node")
              .attr("class", function (d) { return d.group; })
              .on("dblclick", dblclick)
              .call(force.drag);

          // append the node
          node.append("circle")
              .attr("r", function (d) { return d.size/2; })
              .attr("stroke", function (d) {
                // if the node has an origin, it is a foreign key
                if (d.origin) {
                  // give it a stroke that matches the color of its link
                  return color(colors[d.origin-1]);
                } else {
                  return "white";
                }
              })
              .attr("stroke-width", function (d) {
                  return 4;
              })
              .style("fill", function (d) {
                return color(colors[d.group-1]);
              });
          // append the field/table name
          node.append("text")
                .attr("dx", 10)
                .attr("dy", ".35em")
                .text(function (d) { return d.name })
                .attr("text-decoration", function (d) { return d.isPk === true ? "underline" : "none"; })
                .attr("font-weight", function (d) { return d.type === "title" ? "bold" : "normal"; });

          //Give the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
          force.on("tick", function () {
            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            svg.selectAll("circle")
                .attr("cx", function (d) { return d.x = Math.max(d.size/2, Math.min(width - d.size/2, d.x)); })
                .attr("cy", function (d) { return d.y = Math.max(d.size/2, Math.min(height - d.size/2, d.y)); });

            svg.selectAll("text").attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });
          });
          var k = 0;
          // Slows down the initial tick of the force layout
          while ((force.alpha() > 1e-2) && (k < 150)) {
              force.tick(),
              k = k + 3;
          }
        };
        
        var dblclick = function (d) {
          d3.select(this).classed("fixed", d.fixed = !d.fixed);
        };
        scope.$on('canvas:new-data', function (e, data) {
          var dataArr = [];
          for (var key in test) {
            dataArr.push(test[key]);
          }
          svg.selectAll("*").remove();
          scope.render(dataArr);
        });
      });
    }};
}]); 

var test = 
//   "0": {
    
//     "attrs": [
//       {
//         "id": "id",
//         "basicType": "Numeric",
//         "size": "",
//         "type": "INT",
//         "attributes": []
//       },
//       {
//         "basicType": "String",
//         "id": "name",
//         "type": "CHAR",
//         "size": "",
//         "attributes": []
//       }
//     ],
//     "name": "Users",
//     "id": 0
//   },
//   "1": {
//     "attrs": [
//       {
//         "id": "id",
//         "basicType": "Numeric",
//         "type": "INT",
//         "size": "",
//         "attributes": []
//       },
//       {
//         "basicType": "Numeric",
//         "id": "Users_id",
//         "origin": 0,
//         "size": "",
//         "type": "INT",
//         "attributes": []
//       }
//     ],
//     "name": "Messages",
//     "id": 1
//   }
// };
// works:
{
  "1": {
    "attrs": [
      {
        "id": "id",
        "type": "INT",
        "basicType": "Numeric",
        "size": "",
        "attributes": [
          "NOT NULL"
        ]
      },
      {
        "id": "name",
        "type": "VARCHAR",
        "basicType": "String",
        "size": "45",
        "attributes": []
      },
      {
        "id": "email",
        "type": "VARCHAR",
        "basicType": "String",
        "size": "45",
        "attributes": []
      }
      ],
    "name": "users",
    "id": 1,
    "primaryKey": {
      "id": "id",
      "type": "INT",
      "basicType": "Numeric",
      "size": "",
      "attributes": [
        "NOT NULL"
      ]
    }
  },
  "2": {
    "attrs": [
      {
        "id": "id",
        "type": "INT",
        "basicType": "Numeric",
        "size": "",
        "attributes": [
          "NOT NULL"
        ]
      },
      {
        "id": "users_id",
        "type": "INT",
        "basicType": "Numeric",
        "size": "",
        "attributes": [],
        "origin": 1
      }
    ],
    "name": "chats",
    "id": 2,
    "primaryKey": {
      "id": "id",
      "type": "INT",
      "basicType": "Numeric",
      "size": "",
      "attributes": [
        "NOT NULL"
      ]
    }
  },
  "3": {
    "attrs": [
      {
        "id": "id",
        "type": "INT",
        "basicType": "Numeric",
        "size": "",
        "attributes": [
          "NOT NULL"
        ]
      },
      {
        "id": "field1",
        "type": "VARCHAR",
        "basicType": "String",
        "size": "",
        "attributes": []
      },
      {
        "id": "field2",
        "type": "CHAR",
        "basicType": "String",
        "size": "45",
        "attributes": []
      },
      {
        "id": "chats_id",
        "type": "INT",
        "basicType": "Numeric",
        "size": "",
        "attributes": [],
        "origin": 2
      }
    ],
    "name": "test",
    "id": 3,
    "primaryKey": {
      "id": "id",
      "type": "INT",
      "basicType": "Numeric",
      "size": "",
      "attributes": [
        "NOT NULL"
      ]
    }
  }
}

