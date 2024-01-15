const UserModel = require("../models/userModel");

const changeAboutControler = async (req, res) => {
    try {
        const responce = await UserModel.findOneAndUpdate(
            { gmail: req.user.gmail },
            { $set: { about: req.body.inputData } },
            { new: true }
        );
        if (!responce) throw new Error("error in updating");
        res.status(201).send("updated");
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = changeAboutControler;
