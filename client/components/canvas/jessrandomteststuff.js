  
  CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL,
    name VARCHAR(45),
    email BIT(45)
  );

  CREATE TABLE chats (
    id INT PRIMARY KEY NOT NULL,
    users_id DATE,
    FOREIGN KEY (users_id) REFERENCES users(id)
  );

  CREATE TABLE test (
    id INT PRIMARY KEY NOT NULL,
    field1 BIT,
    field2 CHAR(45),
    chats_id INT,
    FOREIGN KEY (chats_id) REFERENCES chats(id)
  );


  var mongoose1 = "var blogSchema = new Schema({
      title:  String,
      author: String,
      body:   String,
      comments: [{ body: String, date: Date }],
      date: { type: Date, default: Date.now },
      hidden: Boolean,
      meta: {
        votes: {
          number: 
        },
        favs:  Number
      }
    });";

// 'author: "String",summary: "String",post: "String",metadata: {  votes: "Number",  favs: {    random: "Number"  }},category: "String"';
  var replaceAll = function (str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  var objectify = function (string) {
    // Remove whitespace
    string = string.replace(/\s/g, "");
    var mongoDataTypes = ['String', 'Number', 'Date'];
    mongoDataTypes.forEach(function (type) {
      string = replaceAll(string, type, '"'+type+'"');
    });
    var obj=eval("({"+string+"})");
    return obj;
  };

  var schemaArray = [{
    "author": "String",
    "summary": "String",
    "post": "String",
    "metadata": {
      "votes": "Number",
      "favs": {
        "random": "Number",
        "other": {
          "last": "String"
        }
      }
    },
    "category": "String"
  }];

  var reverseMongo = function (schemaArray) {
    var schemaStorage = {};
    var idCounter = 0;
    schemaArray.forEach(function (object) {
      var schema = {};
      schema.id = idCounter;
      // schema.name = namesArray[0];
      schema.name = "TBD";
      schema.depth = 0;
      schema.keys = {};
      schema.allKeys = {};
      for (var key in object) {
        schema.keys[key] = {"type": object[key]};
        if (typeof object[key] === "object") {
          schema.keys[key].type = "Nested Document";
          schema.keys[key].keys = buildKeys(object[key]); 
        }
      }
      schemaStorage[idCounter] = schema;
      idCounter++;
    });
    return schemaStorage;
  };
    {
       "votes": "Number",
       "favs": {
         "random": "Number",
         "other": {
           "last": "String"
         }
       }
     }
     // returns:
     {
      "votes": {
        "type": "Number"
      },
      "favs": {
        "type": "Nested Document", 
        "keys": {
          "random": {"type": "Number"},
          "other": {
            "type": "Nested Document",
            "keys": {
              "last": {
                "type": "String"
              }
            }
          }
        }
      }
     }
  var buildKeys = function (obj) {
    var keys = {};
    for (var key in obj) {
      if (typeof obj[key] !== "object") {
        return 
      }
    }
    return keys;
  };


  var test = "{
      title:  String,
      author: String,
      body:   String,
      comments: [{ body: String, date: Date }],
      date: { type: Date, default: Date.now },
      hidden: Boolean,
      meta: {
        votes: Number,
        favs:  Number
      }
    }";

  var mongoose2 = [
    "var blogSchemaModel = mongoose.Schema({",
    "author: String,",
    "summary: String,",
    "post: String,",
    "metadata: {",
    "  votes: Number,",
    "  favs: {",
    "    random: Number",
    "  }",
    "},",
    "category: String",
    "});"
  ];

    var mongoose2 = [
    "author: String,",
    "summary: String,",
    "post: String,",
    "metadata: {",
    "  votes: Number,",
    "  favs: {",
    "    random: Number",
    "  }",
    "},",
    "category: String"
  ];
  var singleLine = "var blogSchemaModel = mongoose.Schema({author: String,summary: String,post: String,metadata: {  votes: Number,  favs: {    random: Number  }},category: String});";
  

  

  var reverseMongo = function (schema) {
    var schemaStorage = {};
    schemaStorage.name = schema[0].split(" ")[1];
    schemaStorage.id = 0;
    schemaStorage.depth = 0;
    schemaStorage.keys = {};
    schemaStorage.nestedDocuments = {
      Main: true
    };
    schemaStorage.allKeys = {};
    for (var i = 1; i < schema.length-1; i++) {
      if (schema[i].charAt(0) !== " " && schema[i].charAt(0) !== "}") {
        // it is a key
        var pair = stringify(schema[i]);
        var key = pair.key;
        var val = pair.val;
        
        schemaStorage.keys[key] = {type: val};
        if (val === "Nested Document") {
          schemaStorage.keys[key] = {
            type: val,
            keys: {}
          };
        }
        schemaStorage.allKeys[key] = {
          display: val,
          location: "Main",
          type: val
        };
      }
    }
    return schemaStorage;
  };

  {
    "0": {
      "keys": {
        "author": {
          "type": "String"
        },
        "summary": {
          "type": "String"
        },
        "post": {
          "type": "String"
        },
        "metadata": {
          "type": "Nested Document",
          "keys": {
            "tags": {
              "type": "Array"
            },
            "likes": {
              "type": "Number"
            },
            "shares": {
              "type": "Number"
            }
          }
        },
        "category": {
          "type": "String"
        }
      },
      "name": "blogSchema",
      "id": 0,
      "depth": {
        "Main": 1,
        "true": 2
      },
      "nestedDocuments": {
        "Main": true,
        "Main > metadata": true
      },
      "allKeys": {
        "author": {
          "display": "String",
          "location": "Main",
          "type": "String"
        },
        "summary": {
          "display": "String",
          "location": "Main",
          "type": "String"
        },
        "post": {
          "display": "String",
          "location": "Main",
          "type": "String"
        },
        "metadata": {
          "display": "Nested Document",
          "location": "Main",
          "type": "Nested Document",
          "childKeys": {
            "tags": true,
            "likes": true,
            "shares": true
          },
          "childLocations": {
            "Main > metadata": true,
            "undefined": true
          }
        },
        "tags": {
          "display": "Array",
          "location": "Main > metadata",
          "type": "Array"
        },
        "likes": {
          "display": "Number",
          "location": "Main > metadata",
          "type": "Number"
        },
        "shares": {
          "display": "Number",
          "location": "Main > metadata",
          "type": "Number"
        },
        "category": {
          "display": "String",
          "location": "Main",
          "type": "String"
        }
      }
    }
  }


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


var schemaStorage = {
          "0": {
            "keys": {
              "Summary": {
                "type": "String"
              },
              "Metadata": {
                "type": "Nested Document",
                "keys": {
                  "Upvotes": {
                    "type": "Number"
                  },
                  "Favourites": {
                    "type": "Nested Document",
                    "keys": {
                      "User": {
                        "type": "String"
                      },
                      "Email": {
                        "type": "String"
                      }
                    }
                  }
                }
              },
              "Title": {
                "type": "String"
              },
              "Body": {
                "type": "String"
              },
              "Date": {
                "type": "Date"
              }
            },
            "name": "blogSchema",
            "id": 0,
            "depth": {
              "Main": 1,
              "Main > Metadata": 2,
              "Main > Metadata > Favourites": 3
            },
            "nestedDocuments": [
              "Main",
              "Main > Metadata",
              "Main > Metadata > Favourites"
            ],
            "allKeys": {
              "Summary": "String Location: Main",
              "Metadata": "Nested Document Location: Main",
              "Upvotes": "Number Location: Main > Metadata",
              "Favourites": "Nested Document Location: Main > Metadata",
              "User": "String Location: Main > Metadata > Favourites",
              "Email": "String Location: Main > Metadata > Favourites",
              "Title": "String Location: Main",
              "Body": "String Location: Main",
              "Date": "Date Location: Main"
            }
          },
          "1": {
            "keys": {
              "Company Code": {
                "type": "String"
              },
              "Company Info": {
                "type": "Nested Document",
                "keys": {
                  "Employees": {
                    "type": "Number"
                  },
                  "Contact Info": {
                    "type": "Number"
                  }
                }
              },
              "Share Prices": {
                "type": "Array"
              }
            },
            "name": "stockSchema",
            "id": 1,
            "depth": {
              "Main": 1,
              "Main > Company Info": 2
            },
            "nestedDocuments": [
              "Main",
              "Main > Company Info"
            ],
            "allKeys": {
              "Company Code": "String Location: Main",
              "Company Info": "Nested Document Location: Main",
              "Employees": "Number Location: Main > Company Info",
              "Contact Info": "Number Location: Main > Company Info",
              "Share Prices": "Array Location: Main"
            }
          }
        };










