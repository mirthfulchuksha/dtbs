angular.module('DTBS.main')
.directive('snapSql', function () {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      Snap.plugin(  function( Snap, Element, Paper, global ) {
        
        Element.prototype.getTransformedBB = function() {
          var bb = this.getBBox(1);
          var t = this.node.getTransformToElement( this.paper.node );
          var m = Snap.matrix( t );
          var obj = { x: m.x( bb.x, bb.y ), y: m.y( bb.x, bb.y ), x2: m.x( bb.x2, bb.y2 ), y2: m.y( bb.x2, bb.y2 ),
                   cx: m.x( bb.cx, bb.cy ), cy: m.y( bb.cy, bb.cy ) }
          obj['width'] =  obj.x2 - obj.x
          obj['height'] = obj.y2 - obj.y
          return obj;
        };

      Paper.prototype.connection = function (obj1, obj2, line, bg) {
        console.log( 'obj1', obj1 )
          if (obj1.line && obj1.from && obj1.to) {
            line = obj1;
            obj1 = line.from;
            obj2 = line.to;
          }
        console.log( 'tbb', obj1.getTransformedBB() )    
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

      var el;
      (function () {
          var color, i, ii, tempS, tempT;
          var dragger = function () {
            this.data('origTransform', this.transform().local )
            this.animate({"fill-opacity": .5}, 500);
          },
              move = function (dx, dy) {
                this.attr({ transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]})
                for (var i = connections.length; i--;) {
                  s.connection(connections[i]);
                }
              },
              up = function () {
                this.animate({"fill-opacity": 0}, 500);
                // Fade paired element on mouse up
                this.animate({"fill-opacity": 1}, 500);
              },
              s = Snap("#svgout"),
              connections = [],
              shapes = [  // Users
                s.rect(250, 80, 80, 20),
                s.rect(250, 100, 80, 20),
                s.rect(250, 120, 80, 20),
                // Groups
                s.rect(380, 80, 80, 20),
                s.rect(380, 100, 80, 20),
                s.rect(380, 120, 80, 20),
                // Chats
                s.rect(380, 80, 80, 20),
                s.rect(380, 100, 80, 20),
                s.rect(380, 120, 80, 20)
              ],
              texts = [   
                s.text(290, 90, "Users"), //0
                s.text(290, 110, "id"), //1
                s.text(290, 130, "name"), //2
                s.text(420, 90, "Groups"), //3
                s.text(420, 110, "id"), //4
                s.text(420, 130, "owner"), //5
                s.text(420, 90, "Chats"), //6
                s.text(420, 110, "id"), //7
                s.text(420, 130, "owner") //8
              ];
          for (var i = 0, ii = shapes.length; i < ii; i++) {
            color = "grey";
            tempS = shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
            tempT = texts[i].attr({fill: color, stroke: "none", "font-size": 15, cursor: "move"});
          }
          connections.push(s.connection(shapes[1], shapes[5]));
          connections.push(s.connection(shapes[1], shapes[8]));
          var group1 = s.g(shapes[0], shapes[1], shapes[2], texts[0], texts[1], texts[2]);
          var group2 = s.g(shapes[3], shapes[4], shapes[5], texts[3], texts[4], texts[5]);
          var group3 = s.g(shapes[6], shapes[7], shapes[8], texts[6], texts[7], texts[8]);
          group1.drag(move, dragger, up);
          group2.drag(move, dragger, up);
          group3.drag(move, dragger, up);
      })();
    }};
});


