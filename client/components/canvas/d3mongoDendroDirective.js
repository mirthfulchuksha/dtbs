angular.module('DTBS.main')

.directive('d3MongoDendro', ['d3Service', 'mongoData', 'treeFormat', function (d3Service, mongoData, treeFormat) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // Constants for the SVG
        var width = 1000, height = 450, root;

        // Set up the custom colour scale
        var colorLength = 75, colors = [];
        var color = d3.scale.linear().domain([1,colorLength])
              .interpolate(d3.interpolateHcl)
              .range([d3.rgb("#007bff"), d3.rgb('#ffa543')]);

        var maxDepth = function (root) {
          var max = 0;
          root.children.forEach(function (child) {
            var counter = 0;
            for (var level in child.levels) {
              counter++;
            }
            if (counter > max) {
              max = counter;
            }
          });
          return max;
        };

        // Create the SVG
        var svg = d3.selectAll("#dendro")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink");

        scope.render = function (root) {
          var maxHeight = maxDepth(root);
          for (var i = 0; i <= maxHeight; i++) {
            var tableColor = Math.floor(Math.random() * colorLength);
            colors.push(tableColor);
          }
          console.log(colors, "colors")
          var cluster = d3.layout.cluster()
                          .size([height, width]);

          var diagonal = d3.svg.diagonal()
                           .projection(function(d) { return [d.y, d.x]; });

          var nodes = cluster.nodes(root),
              links = cluster.links(nodes);
            
          var linkg = svg.selectAll(".dendrolink")
              .data(cluster.links(nodes))
              .enter().append("g")
              .attr("class", "dendrolink")
              .attr("transform", "translate(100,30)");
          linkg.append("path")
              .attr("class", "dendrolink")
              // .attr("transform", "translate(100,30)")
              .attr("d", diagonal);
                
          linkg.append("text")
              .attr("class", "dendrolinklabel")
              .attr("x", function(d) { return (d.source.y + d.target.y) / 2; })
              .attr("y", function(d) { return (d.source.x + d.target.x) / 2; })
              .attr("text-anchor", "middle")
              .text(function(d) {
                return d.target.type;
              });

          var node = svg.selectAll(".dendronode")
              .data(nodes)
              .enter().append("g")
              .attr("class", "dendronode")
              .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")"; });

          node.append("circle")
              .attr("transform", "translate(100,30)")
              .style("fill", function (d) {
                if (d.name === "Collection") {
                  return color(8);
                } else {
                  return color(colors[d.depth-1]);
                }
              })
              .attr("stroke", function (d) {
                if (d.type === "Nested Document") {
                  return d3.rgb(color(colors[d.depth-1])).darker();
                } else {
                  return "white";
                }
              })
              .attr("stroke-width", function (d) {
                return 4;
              })
              .attr("r", 25/2);

          node.append("text")
              .attr("dx", function(d) { return d.children ? -15 : 15; })
              .attr("dy", 3)
              .attr("class", "dendrolinklabel")
              .attr("transform", "translate(100,30)")
              .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
              .text(function(d) { return d.name; });
        };

        var schemaStorage = {
          "0": {
            "keys": {
              "Summary": {
                "type": "String"
              },
              "Metadata": {
                "type": "Nested Document",
                "keys": {
                  "Upvotes": {
                    "type": "Number"
                  },
                  "Favourites": {
                    "type": "Nested Document",
                    "keys": {
                      "User": {
                        "type": "String"
                      },
                      "Email": {
                        "type": "String"
                      }
                    }
                  }
                }
              },
              "Title": {
                "type": "String"
              },
              "Body": {
                "type": "String"
              },
              "Date": {
                "type": "Date"
              }
            },
            "name": "blogSchema",
            "id": 0,
            "depth": {
              "Main": 1,
              "Main > Metadata": 2,
              "Main > Metadata > Favourites": 3
            },
            "nestedDocuments": [
              "Main",
              "Main > Metadata",
              "Main > Metadata > Favourites"
            ],
            "allKeys": {
              "Summary": "String Location: Main",
              "Metadata": "Nested Document Location: Main",
              "Upvotes": "Number Location: Main > Metadata",
              "Favourites": "Nested Document Location: Main > Metadata",
              "User": "String Location: Main > Metadata > Favourites",
              "Email": "String Location: Main > Metadata > Favourites",
              "Title": "String Location: Main",
              "Body": "String Location: Main",
              "Date": "Date Location: Main"
            }
          },
          "1": {
            "keys": {
              "Company Code": {
                "type": "String"
              },
              "Company Info": {
                "type": "Nested Document",
                "keys": {
                  "Employees": {
                    "type": "Number"
                  },
                  "Contact Info": {
                    "type": "Number"
                  }
                }
              },
              "Share Prices": {
                "type": "Array"
              }
            },
            "name": "stockSchema",
            "id": 1,
            "depth": {
              "Main": 1,
              "Main > Company Info": 2
            },
            "nestedDocuments": [
              "Main",
              "Main > Company Info"
            ],
            "allKeys": {
              "Company Code": "String Location: Main",
              "Company Info": "Nested Document Location: Main",
              "Employees": "Number Location: Main > Company Info",
              "Contact Info": "Number Location: Main > Company Info",
              "Share Prices": "Array Location: Main"
            }
          }
        };
        scope.$on('mongo:new-data', function (e, data) {
          var dataArr = [];
          for (var key in data) {
            dataArr.push(data[key]);
          }
          var schemaData = treeFormat.treeFormatter(dataArr);
          // var schemaData = treeFormat.treeFormatter(schemaStorage);
          svg.selectAll("*").remove();
          var rootNode = {
            "name": "Collection",
            "children": schemaData
          };
          scope.render(rootNode);
        });
      });
    }};
}]);



