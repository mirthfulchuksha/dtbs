
// SAMPLE SQL CODE
  // CREATE TABLE users (
  //   id INT PRIMARY KEY NOT NULL,
  //   name VARCHAR(45),
  //   email BIT(45)
  // );

  // CREATE TABLE chats (
  //   id INT PRIMARY KEY NOT NULL,
  //   users_id DATE,
  //   FOREIGN KEY (users_id) REFERENCES users(id)
  // );

  // CREATE TABLE test (
  //   id INT PRIMARY KEY NOT NULL,
  //   field1 BIT,
  //   field2 CHAR(45),
  //   chats_id INT,
  //   FOREIGN KEY (chats_id) REFERENCES chats(id)
  // );

var mongoose1 = "var blogSchema = new Schema({title:  String,author: String,body:   String,comments: String,date: String,hidden: Boolean,meta: {votes: {number: String},favs:  Number}});";



// Steps:
// 1. put into single line of code
// 2. get the name, put into names array
// 3. slice out between the curly braces, pass into objectify, put onto schema array
// 4. pass schema array and names array into build schema storage function to get schema storage


  var reverseMongo = function (req, res, next) {
      var schemaArray = req.split("\n\n");
      var namesArray = [];
      var jsonArray = [];
      schemaArray.forEach(function (schema) {
        // get the name, put into names array
        schema = schema.trim();
        var name = schema.slice().split("\n")[0].split(" ")[1];
        namesArray.push(name);
        // put into a single line of code 
        var singleLine = schema.replace(/\r?\n|\r/g, "");
        // slice out between the curly braces and push onto the json array
        var openingIndex = singleLine.indexOf('{');
        var obj = objectify(singleLine.slice(openingIndex+1, -3));
        jsonArray.push(obj);
      });
      var schemaStorage = buildSchemaStorage(jsonArray, namesArray);
      // res.send(schemaStorage);
      return schemaStorage;
    };
    var replaceAll = function (str, find, replace) {
      return str.replace(new RegExp(find, 'g'), replace);
    }

    // var singleLine = "var blogSchemaModel = mongoose.Schema({author: String,summary: String,post: String,metadata: {  votes: Number,  favs: {    random: Number  }},category: String});";
    // 'author: "String",summary: "String",post: "String",metadata: {  votes: "Number",  favs: {    random: "Number"  }},category: "String"';
    // expects a single line of code e.g. ^^
    var objectify = function (string) {
      // Remove whitespace
      string = string.replace(/\s/g, "");
      var mongoDataTypes = ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'ObjectID', 'Array'];
      mongoDataTypes.forEach(function (type) {
        string = replaceAll(string, type, '"'+type+'"');
      });
      var obj = eval("({"+string+"})");
      return obj;
    };

    // Expects an array of objects produced by objectify function, e.g. ^^
    var buildSchemaStorage = function (jsonArray, namesArray) {
      var schemaStorage = {};
      var idCounter = 0;

      jsonArray.forEach(function (object) {
        var schema = {};
        schema.id = idCounter;
        schema.name = namesArray[idCounter];
        // schema.name = "TBD";
        schema.keys = {};
        nestedDocsArray = buildNestedDocs(object);
        schema.nestedDocuments = {};

        var startDepth = 0;
        schema.depth = {
          "Main": 1,
          "true": nestedDocsArray.length
        };
        nestedDocsArray.forEach(function (level) {
          schema.nestedDocuments[level] = true;
          startDepth++;
        });
        var allKeysArray = buildAllKeys(object, 0);
        for (var key in object) {
          schema.keys[key] = {"type": object[key]};
          if (typeof object[key] === "object") {
            schema.keys[key].type = "Nested Document";
            schema.keys[key].keys = buildKeys(object[key]); 
          }
        }
        schema.allKeys = {};
        allKeysArray.forEach(function (keyArray) {
          // "Contact Info": "Number Location: Main > Company Info"
          schema.allKeys[keyArray[0]] = {
            "display": keyArray[1],
            "location": nestedDocsArray[keyArray[2]],
            "type": keyArray[1]
          }
          if (keyArray[1] === "Nested Document") {
            var res = getChildKeys(schema.keys, keyArray[0]);
            if (keyArray[0] === "meta") {
              console.log(res, "res")
            }
            // schema.allKeys[keyArray[0]].childKeys = getChildKeys(schema.keys, keyArray[0]);
            // schema.allKeys[keyArray[0]].childLocations = getChildLocations();
          }
        });
        schemaStorage[idCounter] = schema;
        idCounter++;
      });
      return schemaStorage;
    };

    var getChildKeys = function (schemaKeys, key, childKeys) {
      childKeys = childKeys || {};
      for (var field in schemaKeys) {
        console.log(schemaKeys, "schemaKeys")
        console.log(field, "field")
        if (schemaKeys[field] === key) {
          // have found the parent key: get all of its children
          for (var child in schemaKeys[field]) {
            childKeys[child] = true;
            if (schemaKeys[field].type === "Nested Document") {
              getChildKeys(schemaKeys[field], child, childKeys);
            }
          }
        } else if (field.type === "Nested Document") {
          // recurse down through the children to see if its down there
          for (var child in schemaKeys[field]) {
            getChildKeys(schemaKeys[field], key, childKeys)
          }
        }
      }
      console.log(childKeys, "childkeys")
      return childKeys;
    };

// meta child keys:
//  {
//   votes: true,
//   number: true,
//   favs: true
//  }

    // "field2": {
    //         "display": "Nested Document",
    //         "location": "Main",
    //         "type": "Nested Document",
    //         "childKeys": {
    //           "field3": true
    //         },
    //         "childLocations": {
    //           "Main > field2": true,
    //           "undefined": true
    //         }
    //       }

  // takes in json object and returns an array of levels in the format
  //"nestedDocuments": ["Main", "Main > Company Info"]

    var buildNestedDocs = function (obj, nested) {
      nested = nested || ["Main"];
      for (var key in obj) {
        if (typeof obj[key] !== "object") {
          continue;
        } else {
          nested.push(nested[nested.length-1] + " > " + key);
          return buildNestedDocs(obj[key], nested);
        }
      }
      return nested;
    };
    var buildKeys = function (obj) {
      var keys = {};
      for (var key in obj) {
        if (typeof obj[key] !== "object") {
          keys[key] = {"type": obj[key]};
        } else {
          keys[key] = {
            "type": "Nested Document",
            "keys": buildKeys(obj[key])
          };
        }
      }
      return keys;
    };

    var buildAllKeys = function (obj, depth, allKeys) {
      allKeys = allKeys || [];
      for (var key in obj) {
        if (typeof obj[key] !== "object") {
          allKeys.push([key, obj[key], depth]);
        } else {
          allKeys.push([key, "Nested Document", depth]);
          depth++;
          buildAllKeys(obj[key], depth, allKeys);
        }
      }
      return allKeys;
    };

var mything = reverseMongo(mongoose1);
// console.log(mything);
  
  // SAMPLE SCHEMA STORAGE OBJECT FROM MONGO

  // {
  //   "0": {
  //     "keys": {
  //       "author": {
  //         "type": "String"
  //       },
  //       "summary": {
  //         "type": "String"
  //       },
  //       "post": {
  //         "type": "String"
  //       },
  //       "metadata": {
  //         "type": "Nested Document",
  //         "keys": {
  //           "tags": {
  //             "type": "Array"
  //           },
  //           "likes": {
  //             "type": "Number"
  //           },
  //           "shares": {
  //             "type": "Number"
  //           }
  //         }
  //       },
  //       "category": {
  //         "type": "String"
  //       }
  //     },
  //     "name": "blogSchema",
  //     "id": 0,
  //     "depth": {
  //       "Main": 1,
  //       "true": 2
  //     },
  //     "nestedDocuments": {
  //       "Main": true,
  //       "Main > metadata": true
  //     },
  //     "allKeys": {
  //       "author": {
  //         "display": "String",
  //         "location": "Main",
  //         "type": "String"
  //       },
  //       "summary": {
  //         "display": "String",
  //         "location": "Main",
  //         "type": "String"
  //       },
  //       "post": {
  //         "display": "String",
  //         "location": "Main",
  //         "type": "String"
  //       },
  //       "metadata": {
  //         "display": "Nested Document",
  //         "location": "Main",
  //         "type": "Nested Document",
  //         "childKeys": {
  //           "tags": true,
  //           "likes": true,
  //           "shares": true
  //         },
  //         "childLocations": {
  //           "Main > metadata": true,
  //           "undefined": true
  //         }
  //       },
  //       "tags": {
  //         "display": "Array",
  //         "location": "Main > metadata",
  //         "type": "Array"
  //       },
  //       "likes": {
  //         "display": "Number",
  //         "location": "Main > metadata",
  //         "type": "Number"
  //       },
  //       "shares": {
  //         "display": "Number",
  //         "location": "Main > metadata",
  //         "type": "Number"
  //       },
  //       "category": {
  //         "display": "String",
  //         "location": "Main",
  //         "type": "String"
  //       }
  //     }
  //   }
  // }


// SAMPLE TREE DATA
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










