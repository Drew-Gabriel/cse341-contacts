const express = require("express");
const router = express.Router();

const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

// GET ALL CONTACTS
router.get("/", async (req, res) => {
  const result = mongodb.getDb().collection("contacts").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
});

// GET ONE CONTACT
router.get("/:id", async (req, res) => {
  const userId = new ObjectId(req.params.id);

  const result = mongodb
    .getDb()
    .collection("contacts")
    .find({ _id: userId });

  result.toArray().then((lists) => {
    res.status(200).json(lists[0]);
  });
});

module.exports = router;