const axios = require("axios");
require("dotenv").config();

const getLatestNav = async (params) => {
  try {
    const options = {
      method: "GET",
      url: "https://latest-mutual-fund-nav.p.rapidapi.com/latest",
      params: {
        ...params
      },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "latest-mutual-fund-nav.p.rapidapi.com",
      },
    };
    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
    getLatestNav
};
