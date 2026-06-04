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
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.get("/:id", async (req, res) => {
  const userId = new ObjectId(req.params.id);

  const result = await mongodb
    .getDb()
    .collection("contacts")
    .findOne({ _id: userId });

  if (result) res.json(result);
  else res.status(404).json({ message: "Not found" });
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
 *     responses:
 *       201:
 *         description: Created
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
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put("/:id", async (req, res) => {
  const userId = new ObjectId(req.params.id);

  const result = await mongodb
    .getDb()
    .collection("contacts")
    .updateOne({ _id: userId }, { $set: req.body });

  res.json(result);
});

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
 *         description: Deleted
 */
router.delete("/:id", async (req, res) => {
  const userId = new ObjectId(req.params.id);

  const result = await mongodb
    .getDb()
    .collection("contacts")
    .deleteOne({ _id: userId });

  res.json(result);
});

module.exports = router;