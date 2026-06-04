const express = require("express");
const router = express.Router();

const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
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