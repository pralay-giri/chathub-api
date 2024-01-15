const UserModel = require("../models/userModel");

const changeNameControler = async (req, res) => {
    try {
        const responce = await UserModel.findOneAndUpdate(
            { gmail: req?.user?.gmail },
            { $set: { name: req?.body?.name } },
            { new: true }
        );
        if (!responce) throw new Error("error in updating");
        res.status(201).send("updated");
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = changeNameControler;
