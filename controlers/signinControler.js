const UserModel = require("../models/userModel");
require("dotenv").config();
const crypto = require("crypto-js");
const SALT = process.env.SALT;

const getHashedPassword = (password) =>
    crypto.SHA256(password, SALT, crypto.enc.Hex);

const signinControler = async (req, res) => {
    const { name, phone, password, gmail, publicKey } = req.body;
    try {
        const isUserAvalable = await UserModel.findOne({ gmail });
        if (!isUserAvalable) {
            const user = UserModel({
                name,
                phone,
                gmail,
                password: getHashedPassword(password),
                publicKey,
            });
            await user.save();
            res.send("sign up successfull");
        } else {
            res.status(401).send("error in sign up process");
        }
    } catch (error) {
        res.status(500).send("internal server error");
    }
};

module.exports = signinControler;
