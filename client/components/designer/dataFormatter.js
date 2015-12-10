var beforeBreak = [
  {
    "name": "Users",
    "id": 1,
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      }
    ],
    "primaryKey": {
      "id": "id",
      "basicType": "Numeric",
      "type": "INT"
    }
  },
  {
    "name": "Chats",
    "id": 2,
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      },
      {
        "origin": "1",
        "id": "Users_id",
        "type": "INT"
      }
    ],
    "primaryKey": {
      "id": "id",
      "basicType": "Numeric",
      "type": "INT"
    }
  },
  {
    "name": "Groups",
    "id": 3,
    "attrs": [
      {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      },
      {
        "origin": "1",
        "id": "Users_id",
        "type": "INT"
      }
    ],
    "primaryKey": {
      "id": "id",
      "basicType": "Numeric",
      "type": "INT"
    }
  }
];
var linksNodesBeforeBreak = {
  "nodes": [
    {
      "name": "Users",
      "type": "title",
      "pk": {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      },
      "group": 1,
      "size": 32,
      "id": 1,
      "index": 0,
      "weight": 1,
      "x": 342.29298494464774,
      "y": 169.57832002730441,
      "px": 342.34393620319,
      "py": 169.57147411311252
    },
    {
      "name": "id",
      "type": "field",
      "group": 1,
      "size": 16,
      "id": 1,
      "index": 1,
      "weight": 3,
      "x": 388.95627734289207,
      "y": 158.71080784305445,
      "px": 388.8411039781085,
      "py": 158.74638174215625
    },
    {
      "name": "Chats",
      "type": "title",
      "pk": {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      },
      "group": 2,
      "size": 32,
      "id": 2,
      "index": 2,
      "weight": 2,
      "x": 337.7066960147619,
      "y": 70.9093706137136,
      "px": 337.7185193176976,
      "py": 71.00491214304799
    },
    {
      "name": "id",
      "type": "field",
      "group": 2,
      "size": 16,
      "id": 2,
      "index": 3,
      "weight": 1,
      "x": 294.6820398138833,
      "y": 54.46992863292921,
      "px": 294.79322212832875,
      "py": 54.54707792681692
    },
    {
      "name": "Users_id",
      "type": "field",
      "origin": "1",
      "group": 2,
      "size": 16,
      "id": 2,
      "index": 4,
      "weight": 2,
      "x": 371.9272776131376,
      "y": 108.41606900119015,
      "px": 371.8696230308635,
      "py": 108.5018548264636
    },
    {
      "name": "Groups",
      "type": "title",
      "pk": {
        "id": "id",
        "basicType": "Numeric",
        "type": "INT"
      },
      "group": 3,
      "size": 32,
      "id": 3,
      "index": 5,
      "weight": 2,
      "x": 378.7531630759183,
      "y": 258.8613977759115,
      "px": 378.7102509409655,
      "py": 258.78870459677205
    },
    {
      "name": "id",
      "type": "field",
      "group": 3,
      "size": 16,
      "id": 3,
      "index": 6,
      "weight": 1,
      "x": 346.8484614068855,
      "y": 292.0442939247825,
      "px": 346.8959887849546,
      "py": 291.93855192933796
    },
    {
      "name": "Users_id",
      "type": "field",
      "origin": "1",
      "group": 3,
      "size": 16,
      "id": 3,
      "index": 7,
      "weight": 2,
      "x": 395.1961287374394,
      "y": 211.41040378525327,
      "px": 395.09999073561244,
      "py": 211.37377452609783
    }
  ],
  "links": [
    {
      "source": {
        "name": "Users",
        "type": "title",
        "pk": {
          "id": "id",
          "basicType": "Numeric",
          "type": "INT"
        },
        "group": 1,
        "size": 32,
        "id": 1,
        "index": 0,
        "weight": 1,
        "x": 342.29298494464774,
        "y": 169.57832002730441,
        "px": 342.34393620319,
        "py": 169.57147411311252
      },
      "target": {
        "name": "id",
        "type": "field",
        "group": 1,
        "size": 16,
        "id": 1,
        "index": 1,
        "weight": 3,
        "x": 388.95627734289207,
        "y": 158.71080784305445,
        "px": 388.8411039781085,
        "py": 158.74638174215625
      },
      "value": 40
    },
    {
      "source": {
        "name": "Chats",
        "type": "title",
        "pk": {
          "id": "id",
          "basicType": "Numeric",
          "type": "INT"
        },
        "group": 2,
        "size": 32,
        "id": 2,
        "index": 2,
        "weight": 2,
        "x": 337.7066960147619,
        "y": 70.9093706137136,
        "px": 337.7185193176976,
        "py": 71.00491214304799
      },
      "target": {
        "name": "id",
        "type": "field",
        "group": 2,
        "size": 16,
        "id": 2,
        "index": 3,
        "weight": 1,
        "x": 294.6820398138833,
        "y": 54.46992863292921,
        "px": 294.79322212832875,
        "py": 54.54707792681692
      },
      "value": 40
    },
    {
      "source": {
        "name": "Chats",
        "type": "title",
        "pk": {
          "id": "id",
          "basicType": "Numeric",
          "type": "INT"
        },
        "group": 2,
        "size": 32,
        "id": 2,
        "index": 2,
        "weight": 2,
        "x": 337.7066960147619,
        "y": 70.9093706137136,
        "px": 337.7185193176976,
        "py": 71.00491214304799
      },
      "target": {
        "name": "Users_id",
        "type": "field",
        "origin": "1",
        "group": 2,
        "size": 16,
        "id": 2,
        "index": 4,
        "weight": 2,
        "x": 371.9272776131376,
        "y": 108.41606900119015,
        "px": 371.8696230308635,
        "py": 108.5018548264636
      },
      "value": 40
    },
    {
      "source": {
        "name": "Groups",
        "type": "title",
        "pk": {
          "id": "id",
          "basicType": "Numeric",
          "type": "INT"
        },
        "group": 3,
        "size": 32,
        "id": 3,
        "index": 5,
        "weight": 2,
        "x": 378.7531630759183,
        "y": 258.8613977759115,
        "px": 378.7102509409655,
        "py": 258.78870459677205
      },
      "target": {
        "name": "id",
        "type": "field",
        "group": 3,
        "size": 16,
        "id": 3,
        "index": 6,
        "weight": 1,
        "x": 346.8484614068855,
        "y": 292.0442939247825,
        "px": 346.8959887849546,
        "py": 291.93855192933796
      },
      "value": 40
    },
    {
      "source": {
        "name": "Groups",
        "type": "title",
        "pk": {
          "id": "id",
          "basicType": "Numeric",
          "type": "INT"
        },
        "group": 3,
        "size": 32,
        "id": 3,
        "index": 5,
        "weight": 2,
        "x": 378.7531630759183,
        "y": 258.8613977759115,
        "px": 378.7102509409655,
        "py": 258.78870459677205
      },
      "target": {
        "name": "Users_id",
        "type": "field",
        "origin": "1",
        "group": 3,
        "size": 16,
        "id": 3,
        "index": 7,
        "weight": 2,
        "x": 395.1961287374394,
        "y": 211.41040378525327,
        "px": 395.09999073561244,
        "py": 211.37377452609783
      },
      "value": 40
    },
    {
      "source": {
        "name": "id",
        "type": "field",
        "group": 1,
        "size": 16,
        "id": 1,
        "index": 1,
        "weight": 3,
        "x": 388.95627734289207,
        "y": 158.71080784305445,
        "px": 388.8411039781085,
        "py": 158.74638174215625
      },
      "target": {
        "name": "Users_id",
        "type": "field",
        "origin": "1",
        "group": 2,
        "size": 16,
        "id": 2,
        "index": 4,
        "weight": 2,
        "x": 371.9272776131376,
        "y": 108.41606900119015,
        "px": 371.8696230308635,
        "py": 108.5018548264636
      },
      "value": 40
    },
    {
      "source": {
        "name": "id",
        "type": "field",
        "group": 1,
        "size": 16,
        "id": 1,
        "index": 1,
        "weight": 3,
        "x": 388.95627734289207,
        "y": 158.71080784305445,
        "px": 388.8411039781085,
        "py": 158.74638174215625
      },
      "target": {
        "name": "Users_id",
        "type": "field",
        "origin": "1",
        "group": 3,
        "size": 16,
        "id": 3,
        "index": 7,
        "weight": 2,
        "x": 395.1961287374394,
        "y": 211.41040378525327,
        "px": 395.09999073561244,
        "py": 211.37377452609783
      },
      "value": 40
    }
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
        console.log(field.id.toString()+"-"+(graph.nodes.length-1).toString());
        foreignKeys.push([field.id.toString()+":"+(graph.nodes.length-1).toString(), (graph.nodes.length-1).toString()]);
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
  data.forEach(function (table) {
    table.attrs.forEach(function (field) {
      var source, target;
      // if it has a defined origin, it is a foreign key to a primary key in another table
      if (field.origin !== undefined) {
        // find the index in nodes of the primary key for that table id
        primaryKeys.forEach(function (pk) {
          if (pk[0] === parseInt(field.origin)) {
            source = pk[1] + 1;
            return;
          }
        });
        // find the index in nodes of the foreign key for that field
        var counter = 0;
        foreignKeys.forEach(function (fk) {
          // [fieldname: index]
          if (field.id.toString()+":"+(fk[1]).toString() === fk[0]) {
            console.log(fk, "FK Match");
            target = fk[1];
            foreignKeys.splice(counter,1);
            counter++;
            return;
          }
        });
      var fieldToFKLink = {"source": source, "target": target, "value": 40};
      graph.links.push(fieldToFKLink);
      }
    });
  });
  return graph;
};

