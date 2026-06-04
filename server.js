require("dotenv").config();
const express = require("express");
const app = express();

const mongodb = require("./db/connect");
const contactsRoutes = require("./routes/contacts");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Contacts API Running 🚀");
});

app.use("/contacts", contactsRoutes);

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Contacts API",
    version: "1.0.0",
    description: "CSE 341 Contacts API"
  },
  servers: [
    {
      url: "https://cse341-contacts-42r1.onrender.com"
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [__dirname + "/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3000;

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log("Server running on port", port);
    });
  }
});