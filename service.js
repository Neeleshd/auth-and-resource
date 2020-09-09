const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = require("./userSchema");
const axios = require("axios");
const rp = require("request-promise");

let countries;
(async function () {
  countries = await rp.get("https://restcountries.eu/rest/v1/all");
  countries = JSON.parse(countries);
})();
module.exports = {
  register: async function (req, res) {
    try {
      let { username, password } = req.body;
      password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const user = await userSchema.create({ username, password });
      if (user) {
        const token = jwt.sign(user.id, "JWT_PRIVATE_KEY");
        return res.status(200).json({
          token,
          user,
        });
      }
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "Username taken",
        });
      }
      return res.status(500).json({
        message: "something went wrong",
        error,
      });
    }
  },

  getAll: async function (req, res) {
    try {
      const { authorization } = req.headers;
    const userId = jwt.verify(authorization, "JWT_PRIVATE_KEY");
    const user = await userSchema.findById(userId);
    if (!user) {
      throw {status: 404, message: 'User not found'};
    }
    const { page, limit } = req.query;
    const startIdx = (page - 1) * limit;
    console.log(startIdx);
    const result = countries.slice(startIdx, startIdx + Number(limit));

    res.status(200).send({ count: countries.length, result });
    } catch (error) {
      console.log(error)
      res.status(error.status).json({
        message: error.message
      })
    }
  },
};
