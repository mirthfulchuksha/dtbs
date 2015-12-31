# Roadmap
---------------------------------

> DTBS is a web-app that makes designing and building databases easy. The project is open source and contributions to the code are welcome. 

## Feature Wishlist
- Recommendation Engine

  
- Mongoose
  Currently the product supports the basic Mongoose data types String, Number, Date, Buffer, Boolean, Mixed, Objectid, and Array. We do not yet support the functionality to:
  - define creation of Arrays of a certain SchemaType or Sub-document, e.g.
    - Currently supported:

    ```sql
      var ToySchema = new Schema({ name: String }); 
      var ToyBox = new Schema({
        toys: Array,
        buffers: Array,
        string:  Array,
        numbers: Array
        // ... etc
      });
    ```

    - Not currently supported: 
    ```sql
      var ToySchema = new Schema({ name: String });
      var ToyBox = new Schema({
        toys: [ToySchema],
        buffers: [Buffer],
        string:  [String],
        numbers: [Number]
        // ... etc
      });
    ```

  - define custom SchemaTypes
  - add default values, validation, getters/setters, field selection defaults, and other general characteristic setup features of Strings and Numbers e.g.
    - Currently supported:

    ```sql
      updated: Date
    ```

    - Not currently supported: 

    ```sql
      updated: { type: Date, default: Date.now }
    ```

- Sequelize
  - Sequelize is currently enabled, however it is missing the associations functions (belongsTo / hasOne / hasMany / belongsToMany). Ideally, creating an association should add a foreign key constraint to the attributes.

- Additional SQL ORMS
  - Active Record
  - PostgreSQL
  - SQLite
  - MSSQL
  - MariaDB

- Neo4j / Cypher
  - We would like to expand on the product to include graph databases. D3 is perfect for visualising this type of data and for helping the developer to identify patterns. Ideally the code editor would support Cypher Query Language and the links would indicate relationships between nodes.

- Database Integration
  - 

- Canvas Interactivity
  - The ability to drag and 
