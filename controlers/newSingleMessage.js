const messageModel = require("../models/messageModel");
const UserModel = require("../models/userModel");
const conversationModel = require("../models/conversationModel");

const newSingleMessage = async (req, res) => {
    try {
        const { selectedUserPhone, message } = req.body;
        const selectedContactUser = await UserModel.findOne({
            phone: selectedUserPhone,
        });

        const conversation = await conversationModel
            .findOne({
                participants: {
                    $all: [req.user.id, selectedContactUser._id],
                },
            })
            .where("isGroupChat")
            .equals(false);

        if (!conversation) throw new Error("can't send message");

        const messageDoc = new messageModel({
            conversationId: conversation._id,
            senderId: req.user.id,
            messageContent: message.trim(),
        });
        conversation.lastMessage = message.trim();
        await conversation.save();
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

        res.send(newMessage);
    } catch (error) {
        console.log(error);
        res.status(204).send(error.message);
    }
};

module.exports = newSingleMessage;
