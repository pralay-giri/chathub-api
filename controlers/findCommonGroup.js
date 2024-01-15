const GroupSchema = require("../models/groupModel");
const UserModel = require("../models/userModel");

const findCommonGroup = async (req, res) => {
    try {
        const matchingGroups = [];

        const gorups = await GroupSchema.find();
        for (let i = 0; i < gorups.length; i++) {
            await gorups[i].populate({ path: "conversasionId" });
            await gorups[i].conversasionId.populate({ path: "participants" });
        }

        gorups.forEach((group) => {
            group.conversasionId.participants.forEach((id) => {
                if (id.equals(req.user.id)) {
                    matchingGroups.push({
                        id: group._id,
                        name: group.name,
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
