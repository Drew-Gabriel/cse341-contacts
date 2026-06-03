require("dotenv").config();

const express = require("express");
const app = express();

const mongodb = require("./db/connect");
const contactsRoutes = require("./routes/contacts");

// ✅ ADD SWAGGER
const swaggerDocs = require("./swagger");

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/contacts", contactsRoutes);

// ✅ SWAGGER ROUTE
swaggerDocs(app);

// Connect DB + start server
mongodb.initDb((err) => {
  if (err) {
    console.error("Database initialization failed:", err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to MongoDB and running on port ${port}`);
    });
  }
});