angular.module('DTBS.main')

.directive('d3Bars', ['d3Service', 'd3UpdateTable', function (d3Service, d3UpdateTable) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        var width = 640,
        height = 350;
        scope.schemaIds = [];

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

        
        scope.render = function (tableData, tableExists) {
          // if the table already exists, delete that table
          if (tableExists) {
            d3.select("#tableID"+tableData.id).remove();
          }

          var formattedData = dataBuilder(tableData);

          var svg = d3.select("svg");
          // svg.selectAll("*").remove();
          var table = svg.append("foreignObject")
            .attr('id', "tableID"+tableData.id)
            .append("xhtml:body");
          table.append("table");
            // append header row
          table.append('thead').append('tr')
            .selectAll('th')
            .data(scope.columns).enter()
            .append('th')
            .text(function(d) {
              return d.head;
            });

          // append body rows
          table.append('tbody')
            .selectAll('tr')
            .data(formattedData).enter()
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
            });
          scope.dragTable();
        };

        scope.dragTable = function () {
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



