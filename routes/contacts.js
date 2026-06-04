const express = require("express");
const router = express.Router();

const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contacts API
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", async (req, res) => {
  const result = mongodb.getDb().collection("contacts").find();
  res.json(await result.toArray());
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/:id", async (req, res) => {
  const userId = new ObjectId(req.params.id);

  const result = await mongodb
    .getDb()
    .collection("contacts")
    .findOne({ _id: userId });

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 */
router.post("/", async (req, res) => {
  const result = await mongodb
    .getDb()
    .collection("contacts")
    .insertOne(req.body);

  res.status(201).json(result);
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update contact
 *     tags: [Contacts]
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
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 */

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */