const { getGroupFile } = require("../helper/getFile");
const UserModel = require("../models/userModel");

const getGroupControler = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user.id })
            .select("groupList -_id")
            .populate({
                path: "groupList",
            });

        const dataToBeSend = [];

        // populating all the group data's
        for (const group of user.groupList) {
            await group.populate([
                { path: "conversasionId", select: "-_id" },
                { path: "admin", select: "-_id name phone" },
            ]);
            await group.conversasionId.populate({
                path: "participants",
                select: "-_id name phone",
            });
            dataToBeSend.push({
                id: group._id,
                name: group.name,
                profile: getGroupFile(group.profile),
                admin: group.admin,
                participants: group.conversasionId.participants,
                lastMessage: group.conversasionId.lastMessage,
                isGroupChat: group.conversasionId.isGroupChat,
            });
        }
        res.status(200).send(dataToBeSend);
    } catch (error) {
        console.log(error);
        res.status(204).send("error in creating group");
    }
};

module.exports = getGroupControler;
