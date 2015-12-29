  
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
        votes: Number,
        favs:  Number
      }
    });";

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










