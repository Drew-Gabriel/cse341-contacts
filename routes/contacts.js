const express = require("express");
const router = express.Router();

const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

/* =========================
GET ALL CONTACTS
========================= */
router.get("/", async (req, res) => {
  try {
    const result = mongodb.getDb().collection("contacts").find();
    const lists = await result.toArray();

    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
GET ONE CONTACT
========================= */
router.get("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDb()
      .collection("contacts")
      .findOne({ _id: userId });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

/* =========================
POST CONTACT
========================= */
router.post("/", async (req, res) => {
  try {
    const contact = req.body;

    const response = await mongodb
      .getDb()
      .collection("contacts")
      .insertOne(contact);

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
PUT CONTACT
========================= */
router.put("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .collection("contacts")
      .updateOne({ _id: userId }, { $set: req.body });

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* =========================
DELETE CONTACT
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .collection("contacts")
      .deleteOne({ _id: userId });

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;