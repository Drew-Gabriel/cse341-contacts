const { MongoClient } = require("mongodb");
require("dotenv").config();

let database;

const initDb = async (callback) => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);

    await client.connect();

    database = client.db();

    console.log("Connected to MongoDB");

    callback(null, database);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    callback(err);
  }
};

const getDb = () => {
  if (!database) {
    throw Error("Database not initialized");
  }
  return database;
};

module.exports = {
  initDb,
  getDb
};