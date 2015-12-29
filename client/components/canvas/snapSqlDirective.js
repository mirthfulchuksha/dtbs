angular.module('DTBS.main')
.directive('snapSql', [
           'SnapService', 
           'canvasData', 
           'canvasSave', 
           'canvasFormat', function (SnapService, canvasData, canvasSave, canvasFormat) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      SnapService.Snap().then(function (Snap) {
        
        Snap.plugin(  function( Snap, Element, Paper, global ) {  
          Element.prototype.getTransformedBB = function() {
            var bb = this.getBBox(1);
            var t = this.node.getTransformToElement( this.paper.node );
            var m = Snap.matrix( t );
            var obj = { x: m.x( bb.x, bb.y ), y: m.y( bb.x, bb.y ), x2: m.x( bb.x2, bb.y2 ), y2: m.y( bb.x2, bb.y2 ),
                        cx: m.x( bb.cx, bb.cy ), cy: m.y( bb.cy, bb.cy ) }
            obj['width'] =  obj.x2 - obj.x;
            obj['height'] = obj.y2 - obj.y;
            return obj;
          };

          Paper.prototype.connection = function (obj1, obj2, line, bg) {
            if (obj1.line && obj1.from && obj1.to) {
              line = obj1;
              obj1 = line.from;
              obj2 = line.to;
            }
            var bb1 = obj1.getTransformedBB(),
                bb2 = obj2.getTransformedBB(),
                p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
                {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
                {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
                {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
                {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
                {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
                {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
                {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
                d = {}, dis = [];
            for (var i = 0; i < 4; i++) {
              for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x),
                  dy = Math.abs(p[i].y - p[j].y);
                if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                  dis.push(dx + dy);
                  d[dis[dis.length - 1]] = [i, j];
                }
              }
            }
            if (dis.length == 0) {
              var res = [0, 4];
            } else {
              res = d[Math.min.apply(Math, dis)];
            }
            var x1 = p[res[0]].x,
                y1 = p[res[0]].y,
                x4 = p[res[1]].x,
                y4 = p[res[1]].y;
            dx = Math.max(Math.abs(x1 - x4) / 2, 10);
            dy = Math.max(Math.abs(y1 - y4) / 2, 10);
            var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
              y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
              x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
              y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
            var path = "M" + x1.toFixed(3) + "," + y1.toFixed(3) + "C" + [ x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join();

            if (line && line.line) {
              line.bg && line.bg.attr({path: path});
              line.line.attr({path: path});
            } else {
              var color = "#000";
              return {
                bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3 }),
                line: this.path(path).attr({stroke: color, fill: "none" }),
                from: obj1,
                to: obj2
              };
            }
          }
        });
        scope.render = function (s, shapes, texts, dragGroups, fkConnections, tableReferences, fieldTypes, initialPositions) {
          var color, i, ii, tempS, tempT;
          var dragger = function () {
            this.data('origTransform', this.transform().local )
            this.animate({"fill-opacity": .5}, 500);
          };
          var move = function (dx, dy) {
            this.attr({ transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]});
            for (var i = connections.length; i--;) {
              s.connection(connections[i]);
            }
          };
          var up = function () {
            this.animate({"fill-opacity": 0}, 500);
            // Fade paired element on mouse up
            this.animate({"fill-opacity": 1}, 500);
          };

          var connections = [];
          for (var i = 0, ii = shapes.length; i < ii; i++) {
            color = "grey";
            // Setup header field - light grey with black text
            if (tableReferences[i] === "header") {
              tempS = shapes[i].attr({fill: "#D3D3D3", stroke: color, "fill-opacity": 1, "stroke-width": 1, cursor: "move"});
              tempT = texts[i].attr({fill: "black", stroke: "none", "font-size": 14, cursor: "move"});
            } else {
              // Primary Key field has bold text
              if (tableReferences[i] === "primary") {
                tempT = texts[i].attr({fill: "black", stroke: "none", "font-size": 12, "font-weight": "bold", cursor: "move"});
              // Regular field has normal weight
              } else {
                tempT = texts[i].attr({fill: "black", stroke: "none", "font-size": 12, cursor: "move"});
              }
              // Color the fields by data type
              var fieldColor;
              switch(fieldTypes[i]) {
                case "Numeric":
                    fieldColor = "#bad6c5";
                    break;
                case "Bit":
                    fieldColor = "#ef861a";
                    break;
                case "DateTime":
                    fieldColor = "#93afdd";
                    break;
                case "String":
                    fieldColor = "#c765b7";
                    break;
              }
              tempS = shapes[i].attr({fill: fieldColor, stroke: color, "fill-opacity": 0.5, "stroke-width": 1, cursor: "move"});
            }
          }
          fkConnections.forEach(function (fkConnection) {
            connections.push(s.connection.apply(s, fkConnection));
          });
            
          dragGroups.forEach(function (dragGroup) {
            var group = s.group.apply(s, dragGroup);
            group.drag(move, dragger, up);
          });
        }

        var tableWidth = function (table) {
          var max = (table.name).length;
          // get max length of all the fields
          table.attrs.forEach(function (field) {
            var fieldWidth = (field.id+" "+field.type+" "+field.size+" ").length;
            if (fieldWidth > max) {
              max = fieldWidth;
            }
          });
          return max;
        };
        var shapes;
        scope.$on('canvas:new-data', function (e, data) {

          $("#svgout").empty();
          var dataArr = [];
          for (var key in data) {
            dataArr.push(data[key]);
          }
          shapes = [];
          var texts = [], tableReferences = [], fieldTypes = [];
          var s = Snap("#svgout");
          
          var randomIntFromInterval = function (min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
          };
          var dragGroups = [];
          var counter = 0;
          for (var i = 0; i < dataArr.length; i++) {
            var dragGroup = [];
            var table = dataArr[i];
            var width = tableWidth(dataArr[i]) * 8;
            var startX, startY;
            if (!initialPositions) {
              startX = randomIntFromInterval(40, 600);
              startY = randomIntFromInterval(40, 300);
            } else {
              startX = initialPositions.startXs[counter];
              startY = initialPositions.startYs[counter];
            }

            var startYText = startY+15, startXText = startX+10;
            var tableText = s.text(startXText, startYText, table.name);
            var tableShape = s.rect(startX, startY, width, 20);
            
            shapes.push(tableShape);
            texts.push(tableText);
            dragGroup.push(tableShape, tableText);
            // need to know: if its a pk, if its the header field, what type it is
            tableReferences.push("header");
            fieldTypes.push("header");
            var isPk = true;
            counter++;
            table.attrs.forEach(function (field) {
              if (isPk) {
                tableReferences.push("primary");
                isPk = false;
              } else {
                tableReferences.push("field");
              }
              fieldTypes.push(field.basicType);
              startY += 20;
              startYText += 20;
              var fieldShape = s.rect(startX, startY, width, 20);
              if (field.size && field.size.length > 0) {
                var fieldText = s.text(startXText, startYText, field.id+"   "+field.type+"("+field.size+")")
              } else {
                var fieldText = s.text(startXText, startYText, field.id+"   "+field.type);
              }
              shapes.push(fieldShape);
              texts.push(fieldText);
              dragGroup.push(fieldShape, fieldText);
            });
            dragGroups.push(dragGroup);
          }
          
          var container = canvasFormat.dataBuilder(dataArr, false);
          var graph = canvasFormat.fkLinks(container, dataArr);
          
          var fkConnections = [];
          graph.links.forEach(function (link) {
            var fkConnection = [shapes[link.source], shapes[link.target]];
            fkConnections.push(fkConnection);
          });
          console.log(data, "Data")
          if (data.graph) {
            var initialPositions = data.graph;
            scope.render(s, shapes, texts, dragGroups, fkConnections, tableReferences, fieldTypes, initialPositions);
          } else {
            scope.render(s, shapes, texts, dragGroups, fkConnections, tableReferences, fieldTypes);
          }
        });
        
        scope.$on('canvas:alert-data', function (e, data) {
          // pass through the json to the front end
          var positions = {};
          positions.startXs = [];
          positions.startYs = [];
          
          shapes.forEach(function (shape) {
            // if it's a header field, it will be grey
            if ((shape.attr("fill")).toString() === "rgb(211, 211, 211)") {
              positions.startXs.push(shape.attr("x"));
              positions.startYs.push(shape.attr("y"));
            }
          });

          var saveGraph = angular.copy(positions);
          canvasSave.push(positions);
        });
      });
    }
  };
}]);
