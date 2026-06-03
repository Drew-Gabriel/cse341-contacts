const express = require("express");
const router = express.Router();

const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

// =========================
// GET ALL CONTACTS
// =========================
router.get("/", async (req, res) => {
  try {
    const result = mongodb.getDb().db().collection("contacts").find();
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
      .db()
      .collection("contacts")
      .find({ _id: userId });

    const lists = await result.toArray();

    if (lists.length > 0) {
      res.status(200).json(lists[0]);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// =========================
// POST (CREATE CONTACT)
// =========================
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "firstName, lastName, and email are required"
      });
    }

    const contact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("contacts")
      .insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({ message: "Contact added successfully" });
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

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "firstName, lastName, and email are required"
      });
    }

    const updatedContact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("contacts")
      .updateOne(
        { _id: userId },
        { $set: updatedContact }
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
// DELETE (REMOVE CONTACT)
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .db()
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