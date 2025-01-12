require("dotenv").config();
const express = require("express");
const knex = require("./db");
const baseRouter = require("./router");
var morgan = require("morgan");

const app = express();
app.use(express.json());

app.use(morgan("combined"));
app.use("/api/", baseRouter);

app.get("/", (req, res) => {
    res.send("Portfolio management system");
});

module.exports = app;