const UserModel = require("../../models/userModel");
const conversationModel = require("../../models/conversationModel");

const getConverstionId = async (id) => {
    try {
        const conversation = await conversationModel.find({
            participants: { $in: id },
        }).select("_id");
        return conversation;
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = getConverstionId;
