const UserModel = require("../models/userModel");

const deleteChat = async (req, res) => {
    const deletePhone = req.query.phone;
    try {
        const ownDetails = await UserModel.findOne({ phone: req.user.phone });
        const userDetails = await UserModel.findOne({phone: deletePhone});
        if(!ownDetails && !userDetails){
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
