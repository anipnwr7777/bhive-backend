const express = require("express");
const router = express.Router();
const { getInvestments, getPortfolio, createInvestment, getSchemesByFamily } = require("./service/mutualFundService");
const verifyToken = require('./middlewares/verifyTokens')

router.get("/users/:user_id/investments", [verifyToken] ,getInvestments);
router.post("/users/:user_id/investment", [verifyToken], createInvestment);
router.get("/schemes", [verifyToken], getSchemesByFamily)
router.get('/users/:user_id/portfolio', [verifyToken], getPortfolio);

module.exports = router;
