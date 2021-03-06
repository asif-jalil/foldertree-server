/*
 ** Title: FileTree Application
 ** Description: This application will made for API for file tree
 ** Author: Asif
 ** Date: 20.05.2021
 **
 */

// dependencies
const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4sath.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});


// module scaffolding
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
   res.send("Hello World!");
});

client.connect((err) => {
   const folderCollection = client.db("folderTree").collection("folders");
   // get all folder
   app.get("/folders", (req, res) => {
      folderCollection.find({}).toArray((err, doc) => {
         res.send(doc);
      });
   });

   // API for folder add
   app.patch("/addFolder/:id", (req, res) => {
      const id = req.params.id;
      const detail = req.body;
      const folder = {
         _id: ObjectID(),
         ...detail,
      };
      folderCollection
         .findOneAndUpdate(
            { _id: ObjectID(id) },
            { $push: { children: folder } }
         )
         .then((result) => {
            res.send(result.ok > 0);
         });
   });

   // API for folder delete
   app.patch("/deleteFolder/:id", (req, res) => {
      const id = req.params.id;

      folderCollection
         .findOneAndUpdate({}, { $pull: { children: { _id: ObjectID(id) } } })
         .then((result) => {
            console.log(result);
            res.send(result.ok > 0);
         });
   });
});

app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
});
