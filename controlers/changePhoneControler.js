const UserMOdel = require("../models/userModel");
const fs = require("fs");
const path = require("path");

const changePhoneControler = async (req, res) => {
    console.log(req?.body);
    const newPhoneNumber = req?.body?.inputData;
    try {
        //update profile and return old document for further use
        const user = await UserMOdel.findOneAndUpdate(
            { gmail: req?.user?.gmail },
            { $set: { phone: newPhoneNumber } },
            { new: true }
        );
        if (!user) throw new Error("user not found");
        res.status(201).send("updated");
    } catch (error) {
        res.status(404).send(error.message);
    }
};

module.exports = changePhoneControler;
