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





















