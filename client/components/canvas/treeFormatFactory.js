angular.module('DTBS.main')

.factory('treeFormat', function () {
  var buildNested = function (doc, documentName, schemaId, depth) {
    var result = [];
    var subroutine = function (doc, documentName, schemaId, depth) {
      if (doc.type !== "Nested Document") {
        var child = {};
        child.name = documentName;
        child.size = 5000;
        child.type = doc.type;
        child.depth = depth;
        child.schemaId = schemaId;
        return child;
      } else {
        var obj = {};
        obj.name = documentName;
        obj.type = doc.type;
        obj.id = schemaId;
        obj.children = [];
        obj.depth = depth;
        depth++;
        for (var key in doc.keys) {
          if (key !== "type") {
            obj.children.push(subroutine(doc.keys[key], key, schemaId, depth));
          }
        }
        return obj;
      }
    };
    result = subroutine(doc, documentName, schemaId, depth);
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
      var depth = 0;
      var schema = schemaArray[i];
      jsonSchema.name = schema.name;
      jsonSchema.children = [];
      jsonSchema.depth = depth;
      jsonSchema.levels = schema.depth;
      depth++;
      for (var key in schema.keys) {
        var field = {};
        field.name = key;
        field.type = schema.keys[key].type;
        field.schemaId = schema.id;
        field.depth = depth;
        if (schema.keys[key].type !== "Nested Document") {
          field.size = 5000;
        } else {
          depth++;
          field.children = buildNested(schema.keys[key], field.name, schema.id, depth);
        }
        jsonSchema.children.push(field);
      } 
      finalArray.push(jsonSchema);
    }
    return finalArray;
  };
  return {
    treeFormatter: treeFormatter
  };
});