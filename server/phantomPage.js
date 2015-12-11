saveSVG: function (req, res, next) {
    var pageUrl = "http://10.6.5.173:3000";
    phantom.create("--ignore-ssl-errors=true", "--ssl-protocol=tlsv1", function (ph) {
      ph.createPage(function (page) {
        page.viewportSize = {
          width: 1600,
          height: 1200
        };
        // http://phantomjs.org/api/webpage/handler/on-console-message.html
            page.set('onConsoleMessage', function(msg, lineNum, sourceId) {
              console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
            });

            // http://phantomjs.org/api/webpage/handler/on-error.html
            page.set('onError', function(msg, trace) {
              var msgStack = ['ERROR: ' + msg];
              if (trace && trace.length) {
                msgStack.push('TRACE:');
                trace.forEach(function(t) {
                  msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
                });
              }

              console.error(msgStack.join('\n'));
            });

            // http://phantomjs.org/api/webpage/handler/on-resource-error.html
            page.set('onResourceError', function(resourceError) {
              console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
              console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
            });

            // http://phantomjs.org/api/webpage/handler/on-resource-timeout.html
            page.set('onResourceTimeout', function(request) {
                console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request));
            });
        page.open(pageUrl, function (status) {
            setTimeout(function () {
              // var clipRect = module.exports.getElementBounds(page, 'designer');
              var clipRect;
              var getElementBounds = function (id) {
                return page.evaluate(function (id) {
                  clipRect = document.getElementById('designer').getBoundingClientRect();
                  return {
                    top: clipRect.top,
                    left: clipRect.left,
                    width: clipRect.width,
                    height: clipRect.height
                  };
                }, id);
              };
              // page.clipRect = getElementBounds('designer');
              page.clipRect = {
                bottom: 421.81817626953125,
                height: 350,
                left: 0,
                right: 640,
                top: 71.81817626953125,
                width: 640
              };
              console.log("Capturing designer");
              page.render('schemas.png');
              ph.exit();
            }, 10000);
        });
      });
    });
    res.sendStatus(200);
  }