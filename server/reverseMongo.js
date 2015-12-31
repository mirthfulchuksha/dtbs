
module.exports.reverseMongo = function (req, res, next) {
    // split into schemas
    var schemaArray = req.body.data.split("\n\n");
    var namesArray = [];
    var jsonArray = [];
    schemaArray.forEach(function (schema) {
      // get the name, put into names array
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
      schema.nestedDocuments = buildNestedDocs(object);
      var startDepth = 0;
      schema.depth = {};
      schema.nestedDocuments.forEach(function (level) {
        schema.depth[level] = startDepth;
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
        schema.allKeys[keyArray[0]] = keyArray[1] + " Location: " + schema.nestedDocuments[keyArray[2]];
      });
      schemaStorage[idCounter] = schema;
      idCounter++;
    });
    return schemaStorage;
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