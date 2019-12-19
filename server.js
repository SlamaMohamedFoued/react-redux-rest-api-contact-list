const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");

const app = express();

app.use(express.json());

const mongo_url = "mongodb://localhost:27017";
const database = "api-contacts";

MongoClient.connect(mongo_url, (err, client) => {
  if (err) console.log(err);
  else {
    const db = client.db(database);

    app.post("/addContact", (req, res) => {
      let newContact = req.body;
      db.collection("contacts").insertOne(newContact, (err, data) => {
        if (err) res.send(err);
        else res.send("contat added");
      });
    });

    app.get("/contacts", (req, res) => {
      db.collection("contacts")
        .find()
        .toArray((err, data) => {
          res.send(data);
        });
    });

    app.delete("/deleteContact/:id", (req, res) => {
      let id = ObjectID(req.params.id);
      db.collection("contacts").deleteOne({ _id: id }, (err, data) => {
        if (err) res.send(err);
        else res.send("contact deleted");
      });
    });

    app.put("/updateContact/:id", (req, res) => {
      let id = ObjectID(req.params.id);
      let updatedContact = req.body;
      db.collection("contacts").findOneAndUpdate(
        { _id: id },
        { $set: { ...updatedContact } },
        (err, data) => {
          if (err) res.json({ err: err });
          else res.send("conatct updated");
        }
      );
    });
  }
});

app.listen(5001, err => {
  if (err) console.log(err);
  else console.log("server running on port 5001");
});
