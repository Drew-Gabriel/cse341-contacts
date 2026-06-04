const express = require("express");
const router = express.Router();

const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

// =========================
// GET ALL CONTACTS
// =========================
router.get("/", async (req, res) => {
  try {
    const result = mongodb.getDb().collection("contacts").find();
    const lists = await result.toArray();

    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// GET ONE CONTACT
// =========================
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
    res.status(400).json({ message: "Invalid ID format", error: err.message });
  }
});

// =========================
// POST (CREATE CONTACT)
// =========================
router.post("/", async (req, res) => {
  try {
    const contact = req.body;

    const response = await mongodb
      .getDb()
      .collection("contacts")
      .insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: "Failed to add contact" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// PUT (UPDATE CONTACT)
// =========================
router.put("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .collection("contacts")
      .updateOne(
        { _id: userId },
        { $set: req.body }
      );

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Contact updated successfully" });
    } else {
      res.status(404).json({ message: "Contact not found or no changes made" });
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format", error: err.message });
  }
});

// =========================
// DELETE CONTACT
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .collection("contacts")
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Contact deleted successfully" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format", error: err.message });
  }
});

module.exports = router;