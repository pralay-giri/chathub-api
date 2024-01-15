const UserModel = require("../models/userModel");

const getusercredential = async (req, res) => {
    const { gmail } = req.user;
    try {
        const responce = await UserModel.findOne({ gmail }).select(
            "-contactList -password -status -lastActive -groupList"
        );
        if (!responce) {
            return res.status(404).send("user not found");
        }
        res.status(201).json({
            credential: {
                id: responce._id,
                name: responce.name,
                phone: responce.phone,
                gmail: responce.gmail,
                about: responce.about,
                publicKey: responce.publicKey,
            },
        });
    } catch (error) {
        res.status(404).send("error");
    }
};

module.exports = getusercredential;
