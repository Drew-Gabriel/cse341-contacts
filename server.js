require("dotenv").config();

const express = require("express");
const app = express();

const mongodb = require("./db/connect");
const contactsRoutes = require("./routes/contacts");

// Middleware
app.use(express.json());

// ======================
// ROUTES
// ======================
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/contacts", contactsRoutes);

// ======================
// SWAGGER SETUP
// ======================
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Contacts API",
    version: "1.0.0",
    description: "CSE 341 Contacts API Documentation"
  },
  servers: [
    {
      url: "https://cse341-contacts-42r1.onrender.com"
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

// IMPORTANT: Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ======================
// START SERVER
// ======================
const port = process.env.PORT || 3000;

mongodb.initDb((err) => {
  if (err) {
    console.error("Database initialization failed:", err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to MongoDB and running on port ${port}`);
    });
  }
});