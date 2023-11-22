const UserModel = require("../models/userModel");
const { getGroupFile } = require("../helper/getFile");

const findCommonGroup = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            phone: req.query.phone,
        }).select("_id");

        const response = await UserModel.findOne({ _id: req.user.id })
            .select("groupList -_id")
            .populate({
                path: "groupList",
                select: "conversasionId name profile",
            });

        for (let i = 0; i < response.groupList.length; i++) {
            await response.groupList[i].populate({
                path: "conversasionId",
            });
            await response.groupList[i].conversasionId.populate({
                path: "participants",
                select: "name phone",
            });
        }

        //finding any matching group
        const matchingGroups = [];
        response.groupList.forEach((group) => {
            group.conversasionId.participants.forEach((id) => {
                if (id.equals(user._id)) {
                    matchingGroups.push({
                        id: group._id,
                        name: group.name,
                        profile: getGroupFile(group.profile),
                        admin: group.admin,
                        participants: group.conversasionId.participants,
                        lastMessage: group.conversasionId.lastMessage,
                        isGroupChat: group.conversasionId.isGroupChat,
                    });
                }
            });
        });
        res.send(matchingGroups);
    } catch (error) {
        res.send(error);
    }
};

module.exports = findCommonGroup;
