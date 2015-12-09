var data = 
[
  {
    "name": "Users",
    "id": 1,
    "attrs": [
      {
        "id": "user_id",
        "basicType": "Numeric",
        "type": "INT",
        "size": "10",
        "attributes": [
          "AUTO_INCREMENT"
        ],
        "default": "NOT NULL"
      },
      {
        "id": "user_name",
        "basicType": "String",
        "type": "VARCHAR",
        "size": "15",
        "attributes": [
          "CHARACTER SET"
        ],
        "default": "NOT NULL"
      },
      {
        "id": "subject_id",
        "basicType": "Numeric",
        "type": "INT",
        "size": "25",
        "attributes": [
          "ZEROFILL"
        ],
        "default": "NULL"
      }
    ]
  },
  {
    "name": "Classes",
    "id": 2,
    "attrs": [
      {
        "id": "class_id",
        "basicType": "Numeric",
        "type": "INT",
        "size": "10",
        "attributes": [
          "AUTO_INCREMENT"
        ],
        "default": "NOT NULL"
      },
      {
        "id": "class_name",
        "basicType": "String",
        "type": "VARCHAR",
        "size": "15",
        "attributes": [
          "CHARACTER SET"
        ],
        "default": "NOT NULL"
      }
    ]
  }
];
var dummyData = {
          "nodes":[
            {"name": "Users", "group": 1, "size": 32},
            {"name": "id", "group": 1, "size": 16},
            {"name": "name", "group": 1, "size": 16},
            {"name": "subject_id", "group": 2, "size": 16},
            {"name": "Subjects", "group": 2, "size": 32},
            {"name": "id", "group": 2, "size": 16},
            {"name": "name", "group": 2, "size": 16},
            {"name": "teacher", "group": 2, "size": 16}
            ],
          "links": [
            {"source": 0, "target": 1, "value": 40},
            {"source": 0, "target": 2, "value": 40},
            {"source": 0, "target": 3, "value": 40},
            {"source": 4, "target": 5, "value": 40},
            {"source": 4, "target": 6, "value": 40},
            {"source": 4, "target": 7, "value": 40},
            {"source": 3, "target": 5, "value": 150}
            ]
        };
// function to transform data into dummyData format
var allTables = {nodes: [], links: []};
var groupNumber = 0;
var dataBuilder = function (data) {
  data.forEach(function (table) {
    var centralNode = {
      name: table.name,
      group: groupNumber++,
      size: 32,
      id: table.id
    };
    allTables.nodes.push(centralNode);
    var fieldCounter = 0;
    table.attrs.forEach(function (field) {
      fieldCounter++;
      var fieldNode = {
        name: field.id,
        group: groupNumber,
        size: 16,
        id: table.id
      };
      allTables.nodes.push(fieldNode);
        var fieldToTableLink = {"source": 0, "target": fieldCounter, "value": 40};
      allTables.links.push(fieldToTableLink);
    });
  });
};




