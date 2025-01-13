const express = require("express");
const router = express.Router();
const { getInvestments, getPortfolio, createInvestment, getSchemesByFamily } = require("./service/mutualFundService");

router.get("/users/:user_id/investments", getInvestments);
router.post("/users/:user_id/investment", createInvestment);
router.get("/schemes", getSchemesByFamily)
router.get('/users/:user_id/portfolio', getPortfolio);

module.exports = router;
