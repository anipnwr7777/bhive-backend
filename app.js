require("dotenv").config();
const express = require("express");
const knex = require("./db");
const baseRouter = require("./router");
var morgan = require("morgan");
const cors = require('cors');
const authRoutes = require('./routes/authRoutes')

const app = express();
app.use(express.json());

app.use(cors());
app.use(morgan("combined"));
app.use('/auth', authRoutes);
app.use("/api/", baseRouter);

app.get("/", (req, res) => {
    res.send("Portfolio management system");
});

module.exports = app;