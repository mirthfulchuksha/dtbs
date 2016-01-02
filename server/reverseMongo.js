
module.exports.reverseMongo = function (req, res, next) {
    // split into schemas
    var schemaArray = req.body.data.split("\n\n");
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
    res.send(schemaStorage);
    // return schemaStorage;
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

  var findMatch = function (allKeys, property) {
    for (var key in allKeys) {
      if (key === property) {
        return allKeys[key];
      } else if (allKeys[key].type === "Nested Document") {
        return findMatch(allKeys[key].keys, property);
      }
    }
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









