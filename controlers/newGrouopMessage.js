const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");
const groupModel = require("../models/groupModel");

const newGrouopMessage = async (req, res) => {
    const { selectedGroupId, message } = req.body;
    try {
        const group = await groupModel.findOne({ _id: selectedGroupId });
        const messageDoc = new messageModel({
            conversationId: group.conversasionId,
            messageContent: message,
            senderId: req.user.id,
        });
        const responce = await messageDoc.save();

        const sender = await responce.populate({
            path: "senderId",
            select: "name phone gmail",
        });
        const newMessage = {
            conversationId: responce.conversationId,
            sender: {
                _id: responce.senderId._id,
                name: responce.senderId.name,
                phone: responce.senderId.phone,
                gmail: responce.senderId.gmail,
            },
            messageContent: responce.messageContent,
            timeStamp: responce.timeStamp,
            messageStatus: responce.messageStatus,
            _id: responce._id,
        };

        res.status(201).send(newMessage);
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
};

module.exports = newGrouopMessage;
