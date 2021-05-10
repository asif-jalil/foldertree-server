const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();

const uri = `mongodb+srv://foldertreeadmin:YHa77rr!EavEhNh@cluster0.4sath.mongodb.net/folderTree?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const folderCollection = client.db("folderTree").collection("folders");

  app.get("/folders", (req, res) => {
    folderCollection.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });

  app.post("/addFolder/:id", (req, res) => {
    const id = req.params.id;
    const detail = req.body;
    const folder = {
      _id: ObjectID(),
      ...detail,
    };
    console.log(id);
    folderCollection.updateOne({ _id: ObjectID(id) }, { $push: { children: folder } }).then((result) => {
      console.log(result.matchedCount > 0);
    });
  });

  app.patch("/deleteFolder/:id", (req, res) => {
    const id = req.params.id;
    
    folderCollection.updateOne(
      {},
      {$pull: {children: { _id: ObjectID(id)}}}
    ).then((result) => {
      console.log(result.deletedCount > 0);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
