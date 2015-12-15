angular.module('DTBS.main')

.directive('d3Sql', ['d3Service', 'd3TableClass', 'd3Data', 'd3Format', function (d3Service, d3TableClass, d3Data, d3Format) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // Constants for the SVG
        var width = 640, height = 350;

        // Create the SVG
        var svg = d3.select(element[0])
        .append("svg")
        .attr('id', 'designer')
        .attr('width', width)
        .attr('height', height)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink");

       
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

          var container = d3Format.dataBuilder(tableData);
          var graph = d3Format.fkLinks(container, tableData);
          
          var svg = d3.select("svg");
          //Creates the graph data structure out of the json data
          force.nodes(graph.nodes)
              .links(graph.links)
              .start();

          //Create all the line svgs but without locations yet
          var link = svg.selectAll(".link")
              .data(graph.links)
              .enter().append("line")
              // .attr("stroke-width", "2")
              .style("stroke", "black")
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
              .attr("stroke", function (d) {
                // if the node has an origin, it is a foreign key
                if (d.origin) {
                  // need to give it a stroke that matches the color of its link
                  return color(d.origin);
                }
              })
              .attr("stroke-width", function (d) {
                if (d.origin) {
                  return 4;
                }
              })
              .style("fill", function (d) {
                return color(d.group);
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

            d3.selectAll("circle")
                .attr("cx", function (d) { return d.x = Math.max(d.size/2, Math.min(width - d.size/2, d.x)); })
                .attr("cy", function (d) { return d.y = Math.max(d.size/2, Math.min(height - d.size/2, d.y)); });

            d3.selectAll("text").attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });
          });
        };
        
        var click = function (node) {
          var className = $(node).attr('class');
          var classToSend = angular.copy(className);
          d3TableClass.push(classToSend);
        };
        var dblclick = function (d) {
          d3.select(this).classed("fixed", d.fixed = !d.fixed);
        };
        scope.$on('d3:new-data', function (e, data) {
          var dataArr = [];
          for (var key in data) {
            dataArr.push(data[key]);
          }
          svg.selectAll("*").remove();
          scope.render(dataArr);
        });
      });
    }};
}]);



