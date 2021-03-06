
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

var mongoose1 = "var blogSchema = new Schema({title:  String,author: String,body:   String,comments: String,date: String,hidden: Boolean,meta: {votes: {number: String, something: String},favs:  Number}});";

var weird = "var bioSchema = new Schema({education: {degree: String,institution: String,year: Date},workexperience: {employers: {company: String,reference: {name: String,phone: Number,email: String},yearFrom: Number,yearTo: Number},years: Number}});"

var weirder = "var bioSchema = new Schema({workexperience: {employers: {company: String,reference: {name: String,phone: Number,email: String},yearFrom: Number,yearTo: Number},years: Number}});"

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
        schema.allKeys[keyArray[0]] = {
          "display": keyArray[1],
          "location": nestedDocsArray[keyArray[2]],
          "type": keyArray[1]
        }
        if (keyArray[1] === "Nested Document") {
          var subDoc = findMatch(schema.keys, keyArray[0]);
          schema.allKeys[keyArray[0]].childKeys = getChildKeys(subDoc.keys);
          schema.allKeys[keyArray[0]].childLocations = getChildLocations(schema.allKeys[keyArray[0]].childKeys, keyArray[0]);
        }
      });
      schemaStorage[idCounter] = schema;
      idCounter++;
    });
    return schemaStorage;
  };

  var getChildLocations = function (childKeys, startKey) {
    var childLocations = {};
    var level = "Main > " + startKey;
    childLocations[level] = true;
    var childKeysArray = Object.keys(childKeys);
    for (var i = 0; i < childKeysArray.length-1; i++) {
      if (childKeysArray[i] !== 'type' && childKeysArray[i] !== 'keys') {
        level += " > " +childKeysArray[i];
        childLocations[level] = true;
      }
    }
    return childLocations;
  };

  // var findMatch = function (allKeys, property) {
  //   for (var key in allKeys) {
  //     if (key === property) {
  //       return allKeys[key];
  //     } else if (allKeys[key].type === "Nested Document") {
  //       return findMatch(allKeys[key].keys, property);
  //     }
  //   }
  // }

  var findMatch = function (allKeys, property) {
    // check if we can find it on current level, if yes, return the object
    for (var key1 in allKeys) {
      if (key1 === property) {
        return allKeys[key1];
      }
    }
    // check if we can find a nested document, it might be down there
    for (var key2 in allKeys) {
      if (allKeys[key2].type === "Nested Document") {
        return findMatch(allKeys[key2].keys, property);
      }
    }
  };

  education: {
    degree: String,
    institution: String,
    year: Date
  },
  workexperience: {
    employers: {
      company: String,
      reference: {
        name: String,
        phone: Number,
        email: String
      },
        yearFrom: Number,
        yearTo: Number
      },
        years: Number
  }

  var getChildKeys = function (objKeys, childKeys) {
    childKeys = childKeys || {};
    for (var key in objKeys) {
      childKeys[key] = true;
      if (objKeys[key].type === "Nested Document") {
        getChildKeys(objKeys[key].keys, childKeys);
      }
    }
    return childKeys;
  };

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

var mything = reverseMongo(weird);
console.log(mything['0'].allKeys);
  
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









