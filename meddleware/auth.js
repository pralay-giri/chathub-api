const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    jwt.verify(token, process.env.JWTPRIVATE, (err, data) => {
        if (!err) {
            req.user = data;
            next();
        } else {
            return res.send("token expried");
        }
    });
};
module.exports = auth;
