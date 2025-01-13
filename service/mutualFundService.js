const Investment = require("../models/Investment");
const User = require("../models/User");
const rapidApiService = require('./rapidApi')

const getInvestmentsForUser = async (userId) => {
	if (!userId) {
		throw new Error({ error: "Invalid userId. It must be a numeric value." });
	}

	try {
		const user = await User.query().findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const investments = await Investment.query()
			.where("user_id", userId)
			.select(
				"id",
				"scheme_code",
				"purchase_nav",
				"investment_amount",
				"purchase_date"
			);

		return investments
	} catch (error) {
		throw error
	}
}

const getInvestments = async (req, res, next) => {
	const userId  = req.params.user_id;
	try {
		const investments = await getInvestmentsForUser(userId)
		res.status(200).json(investments);
	} catch (error) {
		res.status(500).send("Error fetching investments")
	}
}

const getPortfolio = async (req, res, next) => {
    try {
        const investments = await getInvestmentsForUser(req.params.user_id);
        const portfolio = {
            user_id: req.params.user_id,
        };

        const navPromises = investments.map(async (investment) => {
            const data = await rapidApiService.getLatestNav({
                Scheme_Code: investment.scheme_code,
            });
            return {
                scheme_code: investment.scheme_code,
                purchaseNav: investment.purchase_nav,
                currentNav: data?.Net_Asset_Value,
            };
        });

        const navResults = await Promise.all(navPromises);

        navResults.forEach((result) => {
            portfolio[result.scheme_code] = {
                purchaseNav: result.purchaseNav,
                currentNav: result.currentNav,
            };
        });

        res.status(200).send(portfolio);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching portfolio");
    }
}

const createInvestment = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { scheme_code, investment_amount } = req.body;

        if (!scheme_code || !investment_amount) {
            return res
                .status(400)
                .json({ error: "Please provide scheme_code and investment_amount" });
        }

        const user = await User.query().findById(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const navResponse = await rapidApiService.getLatestNav({
            Scheme_Code: scheme_code
        });
        const purchase_nav = navResponse?.Net_Asset_Value || 0;

        const newInvestment = await Investment.query().insert({
            user_id: user.id,
            scheme_code,
            purchase_nav,
            investment_amount,
        });

        res.status(201).json({
            message: "Investment created successfully",
            investment: newInvestment,
        });
    } catch (error) {
        console.error("Error creating investment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getSchemesByFamily = async (req, res, next) => {
    const mutualFundFamily = req.query.fund_house
    if (!mutualFundFamily) {
        throw new Error('Mutual Fund Family parameter is required');
    }

    try {
        const data = await rapidApiService.getSchemes({
            Mutual_Fund_Family: mutualFundFamily,
        });

        res.status(200).send(data)
    } catch (error) {
        console.error("Error fetching schemes by Mutual_Fund_Family:", error);
        throw new Error("Error fetching schemes by Mutual_Fund_Family");
    }
};

module.exports = {
    getInvestments,
    getPortfolio,
    createInvestment,
    getSchemesByFamily
};