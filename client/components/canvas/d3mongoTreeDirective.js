angular.module('DTBS.main')

.directive('d3MongoTree', ['d3Service', 'mongoData', 'treeFormat', function (d3Service, mongoData, treeFormat) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // Constants for the SVG
        var width = 1000, height = 650, root;

        // Set up the custom colour scale
        var colorLength = 75, colors = [];
        var color = d3.scale.linear().domain([1,colorLength])
              .interpolate(d3.interpolateHcl)
              .range([d3.rgb("#007bff"), d3.rgb('#ffa543')]);

        // Create the SVG
        var svg = d3.selectAll("#tree")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink");

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

        scope.render = function (root) {
          var maxHeight = maxDepth(root);
          for (var i = 0; i <= maxHeight; i++) {
            var tableColor = Math.floor(Math.random() * colorLength);
            colors.push(tableColor);
          }
          var tick = function () {
            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });

            labels.attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });
          };
          var force = d3.layout.force()
            .size([width, height])
            .linkDistance(function (d) {
              // if it is of type nested document, make its link longer
              if (d.target.type === "Nested Document") {
                return 70; 
              } else {
                return 45;
              }
            })
            .charge(-300)
            .on("tick", tick);

          var link = svg.selectAll(".link"),
              node = svg.selectAll(".node"),
              labels = svg.selectAll(".label");

          var update = function () {
            var nodes = flatten(root),
                links = d3.layout.tree().links(nodes);

          root.fixed = true;
            root.x = width / 2;
            root.y = height / 2;

            // Restart the force layout.
            force.nodes(nodes)
                .links(links)
                .start();

            // Update the links…
            link = link.data(links, function (d) { return d.target.id; });

            // Exit any old links.
            link.exit().remove();

            // Enter any new links.
            link.enter().insert("line", ".node")
                .attr("class", "link")
                .style("stroke", "grey")
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            // Update the nodes…
            node = node.data(nodes, function (d) { return d.id; });

            // Exit any old nodes.
            node.exit().remove();
            // Enter any new nodes.
            node.enter().append("circle")
                .attr("class", "node")
                .style("fill", function (d) {
                  if (d.name === "Collection") {
                    return color(1);
                  } else {
                    return color(colors[d.depth]);
                  }
                })
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("r", function (d) {
                  if (d.name === "Collection") {
                    return 5;
                  } else if (d.type === "Nested Document") {
                    return 8.5;
                  } else {
                    return 12.5;
                  }
                })
                .attr("stroke", function (d) {
                  if (d.name === "Collection") {
                    return color(8);
                  } else if (d.type === "Nested Document") {
                    return d3.rgb(color(colors[d.depth])).darker();
                  } else {
                    return "white";
                  }
                })
                .attr("stroke-width", function (d) {
                  return 4;
                })
                .on("click", click)
                .on("dblclick", function () {
                  dblclick(this); })
                .call(force.drag);

            labels = labels.data(nodes, function (d) { return d.id; })

            // Exit any old labels.
            labels.exit().remove();

            labels.enter().append("text")
                .attr("class", "label")
                .style('font-size', "12px")
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; })
                .attr("dx", 9)
                .attr("dy", ".31em")
                .text(function (d) { return d.name; })
                .style("font-weight", function (d) {
                  if (d.name === "Collection") {
                      return "bold";
                  } else {
                    return "normal";
                  }
                });
            };
          // Toggle children on click.
          var click = function (d) {
            if (!d3.event.defaultPrevented) {
              if (d.children) {
                d._children = d.children;
                d.children = null;
              } else {
                d.children = d._children;
                d._children = null;
              }
              update();
            }
          };
          // Returns a list of all nodes under the root.
          var flatten = function (root) {
            var nodes = [], i = 0;

            var recurse = function (node) {
              if (node.children) node.children.forEach(recurse);
              if (!node.id) node.id = ++i;
              nodes.push(node);
            }
            recurse(root);
            return nodes;
          };
          update();
        };

        var dblclick = function (d) {
          d3.select(this).classed("fixed", d.fixed = !d.fixed);
        };
        var click = function (d) {
          d3.select(this).classed("fixed", d.fixed = !d.fixed);
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



