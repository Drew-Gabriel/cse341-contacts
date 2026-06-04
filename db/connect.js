const mongodb = require("mongodb");
require("dotenv").config();

let database;

const initDb = (callback) => {
  if (database) return callback(null, database);

  mongodb.MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      // IMPORTANT: choose your database name here
      database = client.db("contacts");

      console.log("Connected to MongoDB");

      callback(null, database);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      callback(err);
    });
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