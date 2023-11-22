const ConversationModel = require("../models/conversationModel");
const MessageModel = require("../models/messageModel");

const deleteAllChat = async (req, res) => {
    try {
        const { selectedContactId } = req.query;
        const conversationId = await ConversationModel.findOne({
            participants: {
                $all: [req.user.id, selectedContactId],
            },
            isGroupChat: false,
        }).select("_id");
        const responce = await MessageModel.deleteMany({conversationId: conversationId._id});
        res.status(202).send(responce);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

module.exports = deleteAllChat;
