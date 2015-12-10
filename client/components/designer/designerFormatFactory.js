angular.module('DTBS.main')

.factory('d3Format', function() {

  var buildCentralNode = function(table, groupNumber) {
    var centralNode = {
      name: table.name,
      type: "title",
      pk: table.primaryKey,
      group: groupNumber,
      size: 32,
      id: table.id
    };
    return centralNode;
  };
  var buildFieldNode = function (table, field, groupNumber) {
    var fieldNode = {
      name: field.id,
      type: "field",
      origin: field.origin,
      group: groupNumber,
      size: 16,
      id: table.id
    };
    return fieldNode;
  };
  var dataBuilder = function (data) {
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
      var fieldCounter = i;
      for (var j = 0; j < table.attrs.length; j++) {
        var field = table.attrs[j];
        fieldCounter++;
        // Build Field Node =====================================
        var fieldNode = buildFieldNode(table, field, groupNumber);
        graph.nodes.push(fieldNode);
        // Add Field to Central Node Link =======================
        var fieldToTableLink = {"source": currentLength, "target": graph.nodes.length-1, "value": 40};
        graph.links.push(fieldToTableLink);
        // Check for origin - denotes FK relationship ===========
        if (field.origin) {
          var fieldIdString = field.id.toString()+":";
          var currentNodesIndex = (graph.nodes.length-1).toString();
          fieldIdString += currentNodesIndex;
          var tuple = [];
          tuple.push(fieldIdString);
          tuple.push(currentNodesIndex)
          foreignKeys.push(tuple);
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
          var fieldToFKLink = {"source": source, "target": target, "value": 40};
          if (fieldToFKLink.source !== undefined && fieldToFKLink.target !== undefined) {
            graph.links.push(fieldToFKLink);
          }
        }
      });
    });
    return graph;
  };
  return {
    buildCentralNode: buildCentralNode,
    buildFieldNode: buildFieldNode,
    dataBuilder: dataBuilder,
    fkLinks: fkLinks
  };
});

        