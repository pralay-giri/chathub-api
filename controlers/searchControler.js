const UserModel = require("../models/userModel");
const { getFile } = require("../helper/getFile");

const searchControler = async (req, res) => {
    const { phone } = req.query;
    try {
        const responce = await UserModel.findOne({ _id: req.user.id })
            .select("contactList -_id")
            .populate({
                path: "contactList",
                select: "-password -contactList -groupList -_id",
            });

        for (let i = 0; i < responce.contactList.length; i++) {
            const item = responce.contactList[i];
            if (item.phone === phone) {
                const { name, phone, gmail, profile, status, lastActive } =
                    item;
                const obj = {
                    name,
                    phone,
                    gmail,
                    profile: getFile(profile),
                    status,
                    lastActive,
                };
                return res.status(201).send(obj);
            }
        }
        throw new Error("not found");
    } catch (error) {
        return res.status(404).send("not found");
    }
};

module.exports = searchControler;
