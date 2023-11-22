const UserModel = require("../models/userModel");
const path = require("path");
require('dotenv').config();
const crypto = require("crypto-js");
const SALT = process.env.SALT; 

const profilesPath = path.join(process.cwd(), "profiles");

const getHashedPassword = (password)=>{
    const hashedPassword = crypto.SHA256(password, SALT, crypto.enc.Hex);
    return hashedPassword;
}

const signinControler = async (req, res) => {
    const { profilePhoto } = req.files;
    const { name, phone, password, gmail } = req.body;
    const profileString = Date.now() + "-" + profilePhoto.name;

    try {
        const isUserAvalable = await UserModel.findOne({ phone: "9641462810" });
        if (!isUserAvalable) {
            const user = UserModel({
                name,
                phone,
                gmail,
                password: getHashedPassword(password), 
                profile: profileString,
            });
            profilePhoto.mv(path.join(profilesPath, profileString));
            const responce = await user.save();
            res.json(responce);
        } else {
            res.status(500).send("Number already used");
        }
    } catch (error) {
        res.status(500).send("error");
    }
};

module.exports = signinControler;
