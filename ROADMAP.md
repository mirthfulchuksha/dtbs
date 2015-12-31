# Roadmap
---------------------------------

> DTBS is a web-app that makes designing and building databases easy. The project is open source and contributions to the code are welcome. 

## Feature Wishlist
- Recommendation Engine
  Neo4j is not only on the 
  
- Mongoose
  Currently the product supports the basic Mongoose data types String, Number, Date, Buffer, Boolean, Mixed, Objectid, and Array. We do not yet support the functionality to:
  - define creation of Arrays of a certain SchemaType or Sub-document, e.g.
  Currently supported:
    var ToySchema = new Schema({ name: String }); 
    var ToyBox = new Schema({
      toys: Array,
      buffers: Array,
      string:  Array,
      numbers: Array
      // ... etc
    });
  Not currently supported: 
    var ToySchema = new Schema({ name: String });
    var ToyBox = new Schema({
      toys: [ToySchema],
      buffers: [Buffer],
      string:  [String],
      numbers: [Number]
      // ... etc
    });
  - define custom SchemaTypes
  - add default values, validation, getters/setters, field selection defaults, and other general characteristic setup features of Strings and Numbers e.g.
  Currently supported:
    updated: Date
  Not currently supported: 
    updated: { type: Date, default: Date.now }
- Active Record

- Sequelize

- Neo4j / Cypher

- Database Integration

- Canvas Interactivity
