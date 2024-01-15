const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto-js");
const UserModel = require("../models/userModel");
const JWTPRIVATE = process.env.JWTPRIVATE;
const SALT = process.env.SALT;

const generateToken = (payload) => {
    return jwt.sign(payload, JWTPRIVATE, {
        expiresIn: "2day",
    });
};

const isValidPassword = (enteredPassword, storedPassword) => {
    const hashedPassword = crypto.SHA256(enteredPassword, SALT, crypto.enc.Hex);
    const password = hashedPassword.toString(crypto.enc.Hex);
    return password === storedPassword;
};

const loginControler = async (req, res) => {
    const { gmail, password } = req.query;
    try {
        const user = await UserModel.findOne({ gmail });
        if (user) {
            const isValidUser = isValidPassword(password, user.password);
            if (isValidUser) {
                const payload = {
                    id: user._id,
                    name: user.name,
                    gmail: user.gmail,
                };
                user.status = "online";
                await user.save();
                const token = generateToken(payload);
                res.status(201).json({ token });
            } else {
                res.status(401).send("invalid credentials");
            }
        } else {
            res.status(404).send("User Not Found");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = loginControler;
