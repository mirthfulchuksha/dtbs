angular.module('DTBS.main')

.directive('d3MongoDendro', ['d3Service', 'mongoData', 'treeFormat', function (d3Service, mongoData, treeFormat) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // Constants for the SVG
        var width = 640, height = 350, root;
        var color = d3.scale.category20();

        // Create the SVG
        var svg = d3.selectAll("#dendro")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink");

        scope.render = function (root) {
          var cluster = d3.layout.cluster()
                          .size([height, width - 160]);

          var diagonal = d3.svg.diagonal()
                           .projection(function(d) { return [d.y, d.x]; });

          svg.append("g")
          .attr("transform", "translate(100,30)");

          var nodes = cluster.nodes(root),
              links = cluster.links(nodes);
            
          var linkg = svg.selectAll(".dendrolink")
              .data(cluster.links(nodes))
              .enter().append("g")
              .attr("class", "dendrolink");
          linkg.append("path")
              .attr("class", "dendrolink")
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
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

          node.append("circle")
              .attr("r", 5);

          node.append("text")
              .attr("dx", function(d) { return d.children ? -8 : 8; })
              .attr("dy", 3)
              .attr("class", "dendrolinklabel")
              .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
              .text(function(d) { return d.name; });
        };

        var schemaStorage = {
          "1": {
            "name": "blogSchema",
            "keys": {
              "Summary": {"type": "String"},
              "Metadata": {
                "type": "Nested Document",
                "Upvotes": {"type": "Number"},
                "Favourites": {
                  "type": "Nested Document",
                  "User": {"type": "String"},
                  "Email": {"type": "String"}
                }
              },
              "Title": {"type": "String"},
              "Body": {"type": "String"},
              "Date": {"type": "Date"}
            }
          },
          "2": {
            "name": "stockSchema",
            "keys": {
              "Company Code": {"type": "String"},
              "Company Info": {
                "type": "Nested Document",
                "Employees": {"type": "Number"},
                "Contact Info": {"type": "Number"}
              },
              "Share Prices": {"type": "Array"}
            }
          }
        };
        scope.$on('mongo:new-data', function (e, data) {
          var dataArr = [];
          for (var key in data) {
            dataArr.push(data[key]);
          }
          // var schemaData = treeFormat.treeFormatter(dataArr);
          var schemaData = treeFormat.treeFormatter(schemaStorage);
          svg.selectAll("*").remove();
          var rootNode = {
            "name": "Collection",
            "children": schemaData
          };
          console.log(rootNode);
          scope.render(rootNode);
        });
      });
    }};
}]);



