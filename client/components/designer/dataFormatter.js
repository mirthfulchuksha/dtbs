var data = 
[
  {
    "name": "Users",
    "id": 1,
    "primaryKey": {
      "id": "user_id",
      "basicType": "Numeric",
      "type": "INT"
    },
    "attrs": [
      {
        "id": "user_id",
        "basicType": "Numeric",
        "type": "INT"
      },
      {
        "id": "user_name",
        "basicType": "String",
        "type": "VARCHAR"
      },
      {
        "id": "subject_id",
        "basicType": "Numeric",
        "type": "INT"
        "origin": 1,
      }
    ]
  },
  {
    "name": "Classes",
    "id": 2,
    "primaryKey": {
      "id": "class_id",
      "basicType": "Numeric",
      "type": "INT"
    },
    "attrs": [
      {
        "id": "class_id",
        "basicType": "Numeric",
        "type": "INT"
      },
      {
        "id": "class_name",
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
            {"name": "name", "group": 2, "size": 16, "type": "field"},
            {"name": "teacher", "group": 2, "size": 16, "type": "field"}
            ],
          "links": [
          // table links
            {"source": 0, "target": 1, "value": 40},
            {"source": 0, "target": 2, "value": 40},
            {"source": 0, "target": 3, "value": 40},
            {"source": 4, "target": 5, "value": 40},
            {"source": 4, "target": 6, "value": 40},
            {"source": 4, "target": 7, "value": 40},
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
      group: groupNumber,
      size: 32,
      id: table.id
    };
    // push the central node onto the graph
    graph.nodes.push(centralNode);
    var currentLength = graph.nodes.length-1;
    var fieldCounter = i;
    // loop through the current table's fields
    for (var j = 0; j < table.attrs.length; j++) {
      var field = table.attrs[j];
      fieldCounter++;
      var fieldNode = {
        name: field.id,
        type: "field",
        group: groupNumber,
        size: 16,
        id: table.id
      };
      // push the field node onto the graph
      graph.nodes.push(fieldNode);
      // push the table/field link onto the graph
      var fieldToTableLink = {"source": currentLength, "target": graph.nodes.length-1, "value": 40};
      graph.links.push(fieldToTableLink);
    }
    groupNumber++; 
  }
  return graph;
};
// if field has attribute origin, push source: current field index, target: pk of the referenced table


