angular.module('DTBS.main')

.directive('d3MongoTree', ['d3Service', 'canvasData', 'canvasFormat', function (d3Service, canvasData, canvasFormat) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // Constants for the SVG
        var width = 640, height = 350, root;
        var color = d3.scale.category20();

        // Create the SVG
        var svg = d3.selectAll("#tree")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink");

        scope.render = function (root, id) {
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
            .linkDistance(30)
            .charge(-520)
            .on("tick", tick);

          var link = svg.selectAll(".link "+id),
              node = svg.selectAll(".node"+id),
              labels = svg.selectAll(".labels"+id);
          // var link = svg.selectAll(".link"),
          //   node = svg.selectAll(".node"),
          //   labels = svg.selectAll(".labels");

          // Color leaf nodes orange, and packages white or blue.
            //var color = function (d) {
            //  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
          //}

          var update = function () {
            var nodes = flatten(root),
                links = d3.layout.tree().links(nodes);

            // Restart the force layout.
            force.nodes(nodes)
                .links(links)
                .start();

            // Update the links…
            link = link.data(links, function (d) { return d.target.id; });

            // Exit any old links.
            link.exit().remove();

            // Enter any new links.
            link.enter().insert("line", ".node "+id)
                .attr("class", "link "+id)
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            // Update the nodes…
            node = node.data(nodes, function (d) { return d.id; })
                       .style("fill", color);

            // Exit any old nodes.
            node.exit().remove();

            // Enter any new nodes.
            node.enter().append("circle")
                .attr("class", "node "+id)
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("r", function (d) { return Math.sqrt(d.size) / 10 || 4.5; })
                .style("fill", color)
                .on("click", click)
                .call(force.drag);

            labels = labels.data(nodes, function (d) { return d.id; })

            // Exit any old labels.
            labels.exit().remove();

            labels.enter().append("text")
                .attr("class", "labels "+id)
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; })
                .attr("dx", 9)
                .attr("dy", ".31em")
                .text(function (d) { return d.name; })
                .style("fill-opacity", function (d) {
                  var opacity = 1;
                  if (d.name === "parentnode") {
                      opacity = 0;
                  }
                  return opacity;
                })
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
        
        // var click = function (node) {
        //   var className = $(node).attr('class');
        //   var classToSend = angular.copy(className);
        //   d3TableClass.push(classToSend);
        // };
        var dblclick = function (d) {
          d3.select(this).classed("fixed", d.fixed = !d.fixed);
        };
var datajson1 = [{
          "name": "blogSchema",
              "children": [{
              "name": "Date",
                  "children": [{
                  "name": "Type",
                      "size": 5000
              }, {
                  "name": "Default",
                      "size": 5000
              }]
          }, {
              "name": "Meta",
                  "children": [{
                  "name": "Votes",
                      "size": 5000
              }, {
                  "name": "Favs",
                      "size": 5000
              }]
          },
          {"name": "Title", "size": 5000},
          {"name": "Author", "size": 5000},
          {"name": "Body", "size": 5000},
          {"name": "Hidden", "size": 5000}
        ]
      },{
          "name": "blogSchema2",
              "children": [{
              "name": "Date",
                  "children": [{
                  "name": "Type",
                      "size": 5000
              }, {
                  "name": "Default",
                      "size": 5000
              }]
          }, {
              "name": "Meta",
                  "children": [{
                  "name": "Votes",
                      "size": 5000
              }, {
                  "name": "Favs",
                      "size": 5000
              }]
          },
          {"name": "Title", "size": 5000},
          {"name": "Author", "size": 5000},
          {"name": "Body", "size": 5000},
          {"name": "Hidden", "size": 5000}
        ]
      }];
      var nextChar = function (c) {
          return String.fromCharCode(c.charCodeAt(0) + 1);
      };
        scope.$on('canvas:new-data', function (e, data) {
          var dataArr = [];
          for (var key in data) {
            dataArr.push(data[key]);
          }
          svg.selectAll("*").remove();
          var id = 'a';
          for (var i = 0; i < datajson1.length; i++) {
            scope.render(datajson1[i], id);
            id = nextChar(id);
          }
          // datajson1.forEach(function (schema) {
          //   scope.render(schema);
          // });
        });
      });
    }};
}]);



