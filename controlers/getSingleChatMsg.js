const UserModel = require("../models/userModel");
const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");

const getSingleChatMsg = async (req, res) => {
    try {
        const { selectedUserPhone } = req.query;
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

        // fetching all the message consist this conversationId
        const allMessageDoc = await messageModel
            .find({
                conversationId: conversation._id,
            })
            .populate({ path: "senderId", select: "name gmail phone" });

        const dataTobeSend = [];
        allMessageDoc.forEach((message) => {
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

        res.status(201).send(
            dataTobeSend.length ? dataTobeSend : conversation._id
        );
        
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
};

module.exports = getSingleChatMsg;
