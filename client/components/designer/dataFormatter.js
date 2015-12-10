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
        "origin": 2
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
var data2 = [
  {
    "name": "Courses",
    "id": 1,
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "TINYINT"
      },
      {
        "id": "name",
        "basicType": "String",
        "type": "CHAR"
      }
    ],
    "primaryKey": {
      "id": "id",
      "basicType": "Numeric",
      "type": "TINYINT"
    }
  },
  {
    "name": "Students",
    "id": 2,
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      },
      {
        "id": "name",
        "basicType": "String",
        "type": "CHAR"
      },
      {
        "origin": "1",
        "id": "Courses_id",
        "type": "TINYINT"
      }
    ]
  }
];
var data3 = [
  {
    "name": "users",
    "id": 1,
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      },
      {
        "id": "name",
        "basicType": "String",
        "type": "CHAR"
      }
    ],
    "primaryKey": {
      "id": "id",
      "basicType": "Numeric",
      "type": "INT"
    }
  },
  {
    "name": "tweets",
    "id": 2,
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "TINYINT"
      },
      {
        "origin": "1",
        "id": "users_id",
        "type": "INT"
      }
    ],
    "primaryKey": {
      "id": "id",
      "basicType": "Numeric",
      "type": "TINYINT"
    }
  },
  {
    "name": "messages",
    "id": 3,
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "TINYINT"
      },
      {
        "origin": "1",
        "id": "users_id",
        "type": "INT"
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
  // build up foreign key indexes
  var foreignKeys = [];
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
        // we want to store the current index to check after all tables have been parsed
        // [fieldname: index]
        foreignKeys.push([field.id+":"+graph.nodes.length-1, graph.nodes.length-1]);
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
  console.log(primaryKeys, "PKS");
  console.log(foreignKeys, "FKS")
  var graph = graphContainer.graph;
  var source, target;
  data.forEach(function (table) {
    table.attrs.forEach(function (field) {
      // if it has a defined origin, it is a foreign key to a primary key in another table
      if (field.origin) {
        // find the index in nodes of the primary key for that table id
        primaryKeys.forEach(function (pk) {
          if (pk[0] === parseInt(field.origin)) {
            source = pk[1] + 1;
            return;
          }
        });
        // find the index in nodes of the foreign key for that field
        foreignKeys.forEach(function (fk) {
          // [fieldname: index]
          if (field.id+":"+fk[1] === fk[0]) {
            console.log(fk, "FK Match");
            target = fk[1];
            return;
          }
        });
      }
    });
  });
  var fieldToFKLink = {"source": source, "target": target, "value": 40};
  graph.links.push(fieldToFKLink);
  console.log(fieldToFKLink);
  return graph;
};

