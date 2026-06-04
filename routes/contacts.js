const express = require("express");
const router = express.Router();

const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

// =========================
// GET ALL CONTACTS
// =========================
/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     responses:
 *       200:
 *         description: List of all contacts
 */
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
/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Single contact
 *       404:
 *         description: Contact not found
 */
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
/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created
 */
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

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
/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Contact updated
 */
router.put("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const updatedContact = req.body;

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
/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted
 */
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