var data = 
[
  {
    "name": "Users",
    "id": 1,
    "primaryKey": {
      "id": "id",
      "basicType": "Numeric",
      "type": "INT"
    },
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      },
      {
        "id": "name",
        "basicType": "String",
        "type": "VARCHAR"
      },
      {
        "id": "subject_id",
        "basicType": "Numeric",
        "type": "INT",
        "origin": 1
      }
    ]
  },
  {
    "name": "Subjects",
    "id": 2,
    "primaryKey": {
      "id": "id",
      "basicType": "Numeric",
      "type": "INT"
    },
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      },
      {
        "id": "name",
        "basicType": "String",
        "type": "VARCHAR"
      }
    ]
  }
];
var dummyData = {
          "nodes":[
            {"name": "Users", "group": 1, "size": 32, "type": "table"},
            {"name": "id", "group": 1, "size": 16, "type": "field"},
            {"name": "name", "group": 1, "size": 16, "type": "field"},
            {"name": "subject_id", "group": 2, "size": 16, "type": "field"},
            {"name": "Subjects", "group": 2, "size": 32, "type": "table"},
            {"name": "id", "group": 2, "size": 16, "type": "field"},
            {"name": "name", "group": 2, "size": 16, "type": "field"}
            ],
          "links": [
          // table links
            {"source": 0, "target": 1, "value": 40},
            {"source": 0, "target": 2, "value": 40},
            {"source": 0, "target": 3, "value": 40},
            {"source": 4, "target": 5, "value": 40},
            {"source": 4, "target": 6, "value": 40},
          // foreign key links
            {"source": 3, "target": 5, "value": 150}
            ]
        };
// function to transform data into dummyData format
var dataBuilder = function (data) {
  // initialize empty graph
  var graph = {nodes: [], links: []};
  // build up primary key field indices for linking reference
  var primaryKeys = [];
  // initialize group number
  var groupNumber = 1;
  // loop through tables
  for (var i = 0; i < data.length; i++) {
    var table = data[i];
    // build up the central table node
    var centralNode = {
      name: table.name,
      type: "title",
      pk: table.primaryKey,
      group: groupNumber,
      size: 32,
      id: table.id
    };
    // push the central node onto the graph
    graph.nodes.push(centralNode);
      //[tableid: index]
    primaryKeys.push([table.id, graph.nodes.length-1]);
    var currentLength = graph.nodes.length-1;
    var fieldCounter = i;
    // loop through the current table's fields
    for (var j = 0; j < table.attrs.length; j++) {
      var field = table.attrs[j];
      fieldCounter++;
      var fieldNode = {
        name: field.id,
        type: "field",
        origin: field.origin,
        group: groupNumber,
        size: 16,
        id: table.id
      };
      // push the field node onto the graph
      graph.nodes.push(fieldNode);
      // push the table/field link onto the graph
      var fieldToTableLink = {"source": currentLength, "target": graph.nodes.length-1, "value": 40};
      graph.links.push(fieldToTableLink);
      // if the field has an origin property, then it must be a FK linked to a PK field
      if (field.origin) {
        // we want to get the index of where that table's PK is in the nodes array
        primaryKeys.forEach(function (pk) {
          console.log(pk);
          if (pk[0] === field.origin) {
            console.log("Matched");
            // index of primary key
            var source = pk[1];
            // index of current field
            var target = graph.nodes.length-1;
            var fieldToFKLink = {"source": source, "target": target, "value": 40};
            graph.links.push(fieldToFKLink);
            return;
          }
        });
      }
    }
    groupNumber++; 
  }
  return graph;
};

