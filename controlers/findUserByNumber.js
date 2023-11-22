const { getFile } = require("../helper/getFile");
const UserModel = require("../models/userModel");

const findUserByNumber = async (req, res) => {
    try {
        const { numbers } = req.query;
        const dataToBeSend = [];

        for (const number of numbers) {
            const responce = await UserModel.findOne({ phone: number });
            if (!responce) {
                throw new Error("not found");
            }

            const { name, phone, gmail, profile, status, lastActive } = responce;
            dataToBeSend.push({
                name,
                phone,
                gmail,
                profile: getFile(profile),
                status,
                lastActive,
            });
        }
        res.status(200).send(dataToBeSend);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

module.exports = findUserByNumber;
