const Investment = require("../models/Investment");
const User = require("../models/User");
const rapidApiService = require('./rapidApi')

const getInvestmentsForUser = async (userId) => {
	if (!/^\d+$/.test(userId)) {
		return res
			.status(400)
			.json({ error: "Invalid userId. It must be a numeric value." });
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

module.exports = {
    getInvestments,
    getPortfolio
}