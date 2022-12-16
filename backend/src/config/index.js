const express = require("express");
const body = require("body-parser");
const consign = require("consign");
let cors = require("cors");

const app = express();

let corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(body.json());
app.use(body.urlencoded({ extended: true }));

consign()
  .include("./src/controllers/user")
  .into(app);

module.exports = { app };
