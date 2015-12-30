angular.module('DTBS.main')

.directive('d3MongoDendro', [
           'd3Service', 
           'mongoData', 
           'treeFormat', 
           'canvasFormat', 
           function (d3Service, mongoData, treeFormat, canvasFormat) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // Constants for the SVG
        var width = 1000, height = 650, root;

        // Set up the custom colour scale
        var colors = [],
            customRange = canvasFormat.colorSchema(),
            flattened = [];
        customRange.forEach(function (palette) {
          flattened.concat(palette);
        });
        var color = d3.scale.ordinal().range(flattened);

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

          for (var k = 0; k <= maxHeight; k++) {
            var palette = Math.floor(Math.random() * 8);
            var tableColor = Math.floor(Math.random() * customRange[palette].length);
            colors.push(customRange[palette][tableColor]);
          }
          var cluster = d3.layout.cluster()
                          .size([height, width]);

          var diagonal = d3.svg.diagonal()
                           .projection(function(d) { return [d.y, d.x]; });

          var nodes = cluster.nodes(root),
              links = cluster.links(nodes);
            
          var linkg = svg.selectAll(".dendrolink")
              .data(cluster.links(nodes))
              .enter().append("g")
              .style("fill", "none")
              .style("stroke", "#D3D3D3")
              .style("stroke-width", 1.5)
              .attr("transform", "translate(100,5)");
          linkg.append("path")
              .attr("class", "dendrolink")
              .attr("d", diagonal);
                
          linkg.append("text")
          .attr("class", "dendrolinklabel")
          .style("text-anchor", "middle")
          .attr("fill", "black")
          .style("stroke", "black")
          .style("stroke-width", "0.1")
          .attr("x", function(d) { return (d.source.y + d.target.y) / 2; })
          .attr("y", function(d) { return (d.source.x + d.target.x) / 2; })
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
              .attr("transform", "translate(100,5)")
              .style("fill", function (d) {
                if (d.name === "Collection") {
                  return "#823082";
                } else {
                  return colors[d.depth-1];
                }
              })
              .attr("stroke", function (d) {
                if (d.type === "Nested Document") {
                  return d3.rgb(colors[d.depth-1]).darker();
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
              .attr("transform", "translate(100,5)")
              .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
              .text(function(d) { return d.name; });
        };
        scope.$on('mongo:new-data', function (e, data) {
          var dataArr = [];
          for (var key in data) {
            dataArr.push(data[key]);
          }
          var schemaData = treeFormat.treeFormatter(dataArr);
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



