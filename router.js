const express = require("express");
const router = express.Router();
const { getInvestments, getPortfolio } = require("./service/mutualFundService");

router.get("/users/:user_id/investments", getInvestments);
router.get('/users/:user_id/portfolio', getPortfolio);

module.exports = router;
