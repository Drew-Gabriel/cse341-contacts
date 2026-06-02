require("dotenv").config();

const express = require("express");
const app = express();

const mongodb = require("./db/connect");
const contactsRoutes = require("./routes/contacts");

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());
app.use("/contacts", contactsRoutes);

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to MongoDB and running on port ${port}`);
    });
  }
});