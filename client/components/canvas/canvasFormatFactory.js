angular.module('DTBS.main')

.factory('canvasFormat', function() {

  var colorSchema = function () {
    var colors = [
      ["#da5b60" , "#e8898f" , "#f194a2" , "#e8a1b7" , "e5a0bc", "#ddabab" , "#bb5b6f" , "#b17796" ],
      ["#f17f66" , "#ef861a" , "#d78775" , "#e0936d" , "#c78881" ],
      ["#e7ac46" , "#e2b757" , "#dec089" , "#edc88c" ],
      ["#deea97" , "#dee18b" , "#ead88c" , "#b8a681" , "#d3cb9b" ],
      ["#89b6bc" , "#a3ccc8" , "#bad6c5" , "#d1d7af" , "#bbb8a9" ],
      ["#8e7ab4" , "#8c89c2" , "#93afdd" , "#98b0cc" , "#9da4d9" ],
      ["#c765b7" , "#ad4294" , "#af75b4" , "#bb92be" , "#d88cc0" , "#823082" , "#a04f90" , "#baadbf" ],
      ["#c24595" , "#cc4994" , "#e36aac" , "#e36aac" , "#cc4994" , "#b8508a" , "#e870aa" , "#d74797" , "#a01282" , "#bc9eaa" ]
    ];
    return colors;
  };
  var buildCentralNode = function(table, groupNumber) {
    var centralNode = {
      name: table.name,
      type: "title",
      pk: table.primaryKey,
      group: groupNumber,
      size: 45,
      id: table.id
    };
    return centralNode;
  };
  var buildFieldNode = function (table, field, groupNumber, isPrimary) {
    var fieldNode = {
      name: field.id,
      type: "field",
      isPk: isPrimary,
      origin: field.origin,
      group: groupNumber,
      size: 25,
      id: table.id
    };
    return fieldNode;
  };
  var dataBuilder = function (data, isD3) {
    // initialize empty graph
    var graph = {nodes: [], links: []},
        primaryKeys = [],
        foreignKeys = [],
        groupNumber = 1;
    for (var i = 0; i < data.length; i++) {
      var table = data[i];
      // Build Central Node =====================================
      var centralNode = buildCentralNode(table, groupNumber);
      graph.nodes.push(centralNode);
      primaryKeys.push([table.id, graph.nodes.length-1]);
      var currentLength = graph.nodes.length-1;
      var isPrimary = true;
      for (var j = 0; j < table.attrs.length; j++) {
        var field = table.attrs[j];

        // Build Field Node =====================================
        var fieldNode;
        if (isPrimary) {
          fieldNode = buildFieldNode(table, field, groupNumber, true);
          isPrimary = false;
        } else {
          fieldNode = buildFieldNode(table, field, groupNumber, false);
        }
        graph.nodes.push(fieldNode);
        
        // Add Field to Central Node Link =======================
        var fieldToTableLink = {"source": currentLength, "target": graph.nodes.length-1, "value": 50};
        if (isD3) {
          graph.links.push(fieldToTableLink);
        }
        // Check for origin - denotes FK relationship ===========
        if (field.origin) {
          var fieldIdString = field.id.toString()+":";
          var currentNodesIndex = (graph.nodes.length-1).toString();
          fieldIdString += currentNodesIndex;
          foreignKeys.push([fieldIdString, currentNodesIndex]);
        }
      }
      groupNumber++; 
    }
    var container = {};
    container.graph = graph;
    container.primaryKeys = primaryKeys;
    container.foreignKeys = foreignKeys;
    return container;
  };
  var fkLinks = function (graphContainer, data) {
    var primaryKeys = graphContainer.primaryKeys;
    var foreignKeys = graphContainer.foreignKeys;
    var graph = graphContainer.graph;
    data.forEach(function (table) {
      table.attrs.forEach(function (field) {
        var source, target;
        // Check for origin - denotes FK relationship ===========
        if (field.origin !== undefined) {
        // Build Link Source ====================================
          for (var m = 0; m < primaryKeys.length; m++) {
            var pk = primaryKeys[m];
            if (pk[0] === parseInt(field.origin)) {
              source = parseInt(pk[1] + 1);
              break;
            }
          }
          // Build Link Target ===================================
          for (var n = 0; n < foreignKeys.length; n++) {
            var fk = foreignKeys[n];
            if (field.id.toString()+":"+(fk[1]).toString() === fk[0]) {
              target = parseInt(fk[1]);
              // Mark FK as visited
              foreignKeys.splice(n,1);
              break;
            }
          }
          var fieldToFKLink = {"source": source, "target": target, "value": 160};
          if (fieldToFKLink.source !== undefined && fieldToFKLink.target !== undefined) {
            graph.links.push(fieldToFKLink);
          }
        }
      });
    });
    return graph;
  };
  return {
    colorSchema: colorSchema,
    buildCentralNode: buildCentralNode,
    buildFieldNode: buildFieldNode,
    dataBuilder: dataBuilder,
    fkLinks: fkLinks
  };
});

        