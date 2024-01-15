const { response } = require("express");
const UserModel = require("../models/userModel");

const findUserByNumber = async (req, res) => {
    try {
        const { gmails } = req.query;
        const dataToBeSend = [];

        for (const gmail of gmails) {
            const responce = await UserModel.findOne({ gmail: gmail }).select(
                "-password"
            );
            if (!responce) {
                throw new Error("not found");
            }
            dataToBeSend.push(responce);
        }
        res.status(200).send(dataToBeSend);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

module.exports = findUserByNumber;
