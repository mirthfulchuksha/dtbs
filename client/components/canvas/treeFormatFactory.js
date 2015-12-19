angular.module('DTBS.main')

.factory('treeFormat', function () {
  var buildNested = function (doc, documentName) {
    var result = [];
    var subroutine = function (doc, documentName) {
      // Base Case: if the type is not nested document
      if (doc.type !== "Nested Document") {
        var child = {};
        child.name = documentName;
        child.size = 5000;
        return child;
      } else {
        // type is nested document, we want to 
        var obj = {};
        obj.name = documentName;
        obj.children = [];
        for (var key in doc) {
          if (key !== "type") {
            obj.children.push(subroutine(doc[key], key));
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
      console.log(jsonSchema, "json schema");
      console.log(schema, "schema");
      for (var key in schema.keys) {
        var field = {};
        field.name = key;
        console.log(schema.keys[key], "schema.keys[key]")
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
  return {
    treeFormatter: treeFormatter
  };
});