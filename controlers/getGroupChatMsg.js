const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");
const groupModel = require("../models/groupModel");

const getGroupChatMsg = async (req, res) => {
    const { groupId } = req.query;
    try {
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) throw new Error("not found");
        const grouConversationId = group.conversasionId;

        const messages = await messageModel
            .find({
                conversationId: grouConversationId,
            })
            .populate({ path: "senderId", select: "name gmail phone" });

        const dataTobeSend = [];
        messages.forEach((message) => {
            dataTobeSend.push({
                _id: message._id,
                conversationId: message.conversationId,
                sender: {
                    _id: message.senderId._id,
                    name: message.senderId.name,
                    gmail: message.senderId.gmail,
                    phone: message.senderId.phone,
                },
                messageContent: message.messageContent,
                timeStamp: message.timeStamp,
                messageStatus: message.messageStatus,
            });
        });
        res.status(201).send(dataTobeSend.length?dataTobeSend:group.conversasionId);
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
};

module.exports = getGroupChatMsg;
