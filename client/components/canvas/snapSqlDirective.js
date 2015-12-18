angular.module('DTBS.main')
.directive('snapSql', ['SnapService', 'canvasData', 'canvasFormat', function (SnapService, canvasData, canvasFormat) {
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
                bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
                line: this.path(path).attr({stroke: color, fill: "none"}),
                from: obj1,
                to: obj2
              };
            }
          }
        });

        scope.render = function (s, shapes, texts, dragGroups, fkConnections) {
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
            tempS = shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
            tempT = texts[i].attr({fill: color, stroke: "none", "font-size": 12, cursor: "move"});
          }
          fkConnections.forEach(function (fkConnection) {
            connections.push(s.connection.apply(s, fkConnection));
          });
            
          dragGroups.forEach(function (dragGroup) {
            var group = s.group.apply(s, dragGroup);
            group.drag(move, dragger, up);
          });
        };
        scope.$on('canvas:new-data', function (e, data) {
          $("#svgout").empty();
          var dataArr = [];
          for (var key in data) {
            dataArr.push(data[key]);
          }
          var shapes = [], texts = [];
          var s = Snap("#svgout");
          
          var randomIntFromInterval = function (min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
          };
          var dragGroups = [];
          for (var i = 0; i < dataArr.length; i++) {
            var dragGroup = [];
            var table = dataArr[i];
            var startX = randomIntFromInterval(40, 600);
            var startY = randomIntFromInterval(40, 300);

            var startYText = startY+15, startXText = startX+20;
            var tableShape = s.rect(startX, startY, 120, 20);
            var tableText = s.text(startXText, startYText, table.name);
            shapes.push(tableShape);
            texts.push(tableText);
            dragGroup.push(tableShape, tableText);
            table.attrs.forEach(function (field) {
              startY += 20;
              startYText += 20;
              var fieldShape = s.rect(startX, startY, 120, 20);
              var fieldText = s.text(startXText, startYText, field.id+"("+field.type+")");
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
          scope.render(s, shapes, texts, dragGroups, fkConnections);
        });
        
      });
    }
  };
}]);

