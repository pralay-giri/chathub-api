const UserModel = require("../models/userModel");
const { getFile } = require("../helper/getFile");

const getallcontactControler = async (req, res, err) => {
    const page = new Number(req.query.page);
    const limit = new Number(req.query.limit);
    const prevDataLength = new Number(req.query.prevDataLength);
    try {
        const responce = await UserModel.findOne({
            gmail: req.user.gmail,
        })
            .select("contactList -_id")
            .populate({
                path: "contactList",
                select: "-password -contactList -groupList",
            });

        const startingRange = (page - 1) * prevDataLength;
        const endingRange = Math.min(page * limit, responce.contactList.length);

        const users = responce.contactList.slice(startingRange, endingRange);
        res.json(users);
    } catch (error) {
        res.send(error.message);
    }
};

module.exports = getallcontactControler;
