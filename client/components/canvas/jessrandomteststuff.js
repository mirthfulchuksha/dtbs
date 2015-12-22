  var shapes = [  
                // Users
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
              ];
        var texts = [
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
var mocked = [
  {
    "attrs": [
      {
        "id": "id",
        "type": "INT",
        "basicType": "Numeric",
        "size": "",
        "attributes": [
          "NOT NULL",
          "AUTO_INCREMENT"
        ]
      },
      {
        "id": "name",
        "type": "CHAR",
        "basicType": "String",
        "size": "45",
        "attributes": [
          "NOT NULL"
        ]
      },
      {
        "id": "email",
        "type": "CHAR",
        "basicType": "String",
        "size": "45",
        "attributes": []
      }
    ],
    "name": "Users",
    "id": 1,
    "primaryKey": {
      "id": "id",
      "type": "INT",
      "basicType": "Numeric",
      "size": "",
      "attributes": [
        "NOT NULL",
        "AUTO_INCREMENT"
      ]
    }
  }
];

var shapes = [  
  // Users
  s.rect(250, 80, 80, 20),
  s.rect(250, 100, 80, 20),
  s.rect(250, 120, 80, 20)
];
var texts = [
  s.text(290, 90, "Users"), //0
  s.text(290, 110, "id"), //1
  s.text(290, 130, "name") //2
];

var snapFormatter = function (table) {
  var snapTable = {};
  var title = table.name;
  snapTable.shapes = [];
  snapTable.texts = [];
  var startY = 80;
  table.attrs.forEach(function (field) {
    // shape = [x coord, y coord, width, height]
    var shape = [250, startY, 80, 20];
    var text = [250, startY, field.id];
    startY+=20;
    snapTable.shapes.push(shape);
    snapTable.texts.push(text);
  });
  return snapTable;
};


  CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL,
    name VARCHAR(45),
    email VARCHAR(45)
  );

  CREATE TABLE chats (
    id INT PRIMARY KEY NOT NULL,
    users_id INT,
    FOREIGN KEY (users_id) REFERENCES users(id)
  );

  CREATE TABLE test (
    id INT PRIMARY KEY NOT NULL,
    field1 VARCHAR,
    field2 CHAR(45),
    chats_id INT,
    FOREIGN KEY (chats_id) REFERENCES chats(id)
  );
// function to put schemaStorage into datajson format
var buildNested = function (doc, documentName) {
    var result = [];
    var subroutine = function (doc, documentName) {
      if (doc.type !== "Nested Document") {
        var child = {};
        child.name = documentName;
        child.size = 5000;
        child.type = doc.type;
        return child;
      } else {
        var obj = {};
        obj.name = documentName;
        obj.type = doc.type;
        obj.children = [];
        for (var key in doc.keys) {
          if (key !== "type") {
            obj.children.push(subroutine(doc.keys[key], key));
          }
        }
        return obj;
      }
    };
    result = subroutine(doc, documentName);
    return result.children;
  };

  var treeFormatter = function (schemaStorage) {
    var schemaArray = [];
    var finalArray = [];
    // Format into array of objects
    for (var key in schemaStorage) {
      schemaArray.push(schemaStorage[key]);
    }
    // Loop through each schema object in the array
    for (var i = 0; i < schemaArray.length; i++) {
      var jsonSchema = {};
      var schema = schemaArray[i];
      jsonSchema.name = schema.name;
      jsonSchema.children = [];
      for (var key in schema.keys) {
        var field = {};
        field.name = key;
        field.type = schema.keys[key].type;
        if (schema.keys[key].type !== "Nested Document") {
          field.size = 5000;
        } else {
          field.children = buildNested(schema.keys[key], field.name);
        }
        jsonSchema.children.push(field);
      } 
      finalArray.push(jsonSchema);
    }
    return finalArray;
  };

var doc = {
  "type": "Nested Document",
  "Upvotes": {
    "type": "Number"
  },
  "Favourites": {
    "type": "Nested Document",
    "User": {
      "type": "Nested Document",
      "Name": {
        "type": "Nested Document",
        "value": {"type": "String"}
      }
    },
    "Email": {
      "type": "String"
    }
  }
};
var documentName = "Metadata";


var datajson1 = [{
          "name": "blogSchema",
              "children": [{
              "name": "Date",
                  "children": [{
                  "name": "Type",
                      "size": 5000
              }, {
                  "name": "Default",
                      "size": 5000
              }]
          }, {
              "name": "Meta",
                  "children": [{
                  "name": "Votes",
                      "size": 5000
              }, {
                  "name": "Favs",
                      "size": 5000
              }]
          },
          {"name": "Title", "size": 5000},
          {"name": "Author", "size": 5000},
          {"name": "Body", "size": 5000},
          {"name": "Hidden", "size": 5000}
        ]
      },{
          "name": "blogSchema2",
              "children": [{
              "name": "Date",
                  "children": [{
                  "name": "Type",
                      "size": 5000
              }, {
                  "name": "Default",
                      "size": 5000
              }]
          }, {
              "name": "Meta",
                  "children": [{
                  "name": "Votes",
                      "size": 5000
              }, {
                  "name": "Favs",
                      "size": 5000
              }]
          },
          {"name": "Title", "size": 5000},
          {"name": "Author", "size": 5000},
          {"name": "Body", "size": 5000},
          {"name": "Hidden", "size": 5000}
        ]
      }];
      var schemaStorage = {
        "1": {
          "name": "blogSchema",
          "keys": {
            "Summary": {"type": "String"},
            "Metadata": {
              "type": "Nested Document",
              "Upvotes": {"type": "Number"},
              "Favourites": {
                "type": "Nested Document",
                "User": {"type": "String"},
                "Email": {"type": "String"}
              }
            },
            "Title": {"type": "String"},
            "Body": {"type": "String"},
            "Date": {"type": "Date"}
          }
        },
        "2": {
          "name": "stockSchema",
          "keys": {
            "Company Code": {"type": "String"},
            "Company Info": {
              "type": "Nested Document",
              "Employees": {"type": "Number"},
              "Contact Info": {"type": "Number"}
            },
            "Share Prices": {"type": "Array"}
          }
        }
      };
      var schemaStorage2 = {
        "0": {
          "keys": {
            "Summary": {"type": "String"},
            "Metadata": {
              "type": "Nested Document",
              "keys": {
                "Upvotes": {"type": "Number"},
                "Favorites": {"type": "Nested Document",
                  "keys": {
                    "User": {"type": "String"},
                    "Email": {"type": "String"}
                  }
                }
              }
            },
            "Title": {"type": "String"},
            "Body": {"type": "String"},
            "Date": {"type": "Date"}
          },
          "name": "blogSchema"
        }
      };

















