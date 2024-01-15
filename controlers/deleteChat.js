const UserModel = require("../models/userModel");

const deleteChat = async (req, res) => {
    const gmail = req.query.gmail;
    try {
        const ownDetails = await UserModel.findOne({ gmail: req.user.gmail });
        const userDetails = await UserModel.findOne({ gmail: gmail });
        if (!ownDetails && !userDetails) {
            throw new Error("somthing error");
        }
        ownDetails.contactList.remove(userDetails._id);
        await ownDetails.save();
        res.status(201).send(ownDetails);
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
};

module.exports = deleteChat;
