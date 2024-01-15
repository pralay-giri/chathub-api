const UserModel = require("../models/userModel");
const { getFile } = require("../helper/getFile");

const searchControler = async (req, res) => {
    console.log(req.gmail);
    const { gmail } = req.query;
    try {
        const responce = await UserModel.findOne({ _id: req.user.id })
            .select("contactList -_id")
            .populate({
                path: "contactList",
                select: "-password -contactList -groupList -_id",
            });

        for (let i = 0; i < responce.contactList.length; i++) {
            const item = responce.contactList[i];
            if (item.gmail === gmail) {
                return res.status(201).send(item);
            }
        }
        throw new Error("not found");
    } catch (error) {
        return res.status(404).send("not found");
    }
};

module.exports = searchControler;
