angular.module('DTBS.main')

.directive('d3Bars', ['d3Service', 'd3Data', function (d3Service, d3Data) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        var width = 640,
        height = 480;
        scope.counter = 0;

        var svg = d3.select(element[0])
        .append("svg")
        .style('width', '100%')
        .style('height', height);
        
        scope.columns = [
            { head: 'Field',
              html: function(r) { return r.id; } },
            { head: 'Type',
              html: function(r) { return r.type; } }
        ];
        var dataBuilder = function (data) {
          var cols = [];
          data.attrs.forEach(function (col) {
            var row = {};
            row["id"] = col.id;
            row["type"] = col.type;
            cols.push(row);
          });
          return cols;
        };

        
        scope.render = function (tableData) {
          scope.counter++;

          var dummy = dataBuilder(tableData);

          var svg = d3.select("svg");
          svg.selectAll("*").remove();
          var table = svg.append("foreignObject")
            .attr("width", 200)
            .attr('class', "table" + scope.counter)
            .append("xhtml:body");
          table.append("table");
            // append header row
          table.append('thead').append('tr')
            .selectAll('th')
            .data(scope.columns).enter()
            .append('th')
            .attr('class', function(d) {
              return d.cl;
            })
            .text(function(d) {
              return d.head;
            });

          // append body rows
          table.append('tbody')
            .selectAll('tr')
            .data(dummy).enter()
            .append('tr')
            .selectAll('td')
            .data(function(row, i) {
              // evaluate column objects against the current row
              return scope.columns.map(function (c) {
                var cell = {};
                d3.keys(c).forEach(function(k) {
                  cell[k] = typeof c[k] == 'function' ? c[k](row, i) : c[k];
                });
                return cell;
              });
            }).enter()
            .append('td')
            .html(function (d) {
              return d.html;
            })
            .attr('class', function(d) {
              return d.cl;
            });

          var table = d3.selectAll('foreignObject')
          var drag = d3.behavior.drag();

          drag.on('dragstart', function(){
            d3.event.sourceEvent.stopPropagation(); 
            d3.event.sourceEvent.preventDefault(); 
          }); 

          drag.on('drag', function(d){
            var x = d3.event.x; 
            var y = d3.event.y; 
            d3.select(this).attr('x', x).attr('y', y);
          });

          table.call(drag);
          
        };
        scope.$on('d3:new-data', function(e, data) {
          console.log(data);
          scope.render(data);
        });
      });
    }};
}]);



