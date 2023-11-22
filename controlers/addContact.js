const UserModel = require("../models/userModel");
const ConversationModel = require("../models/conversationModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const addContact = async (req, res) => {
    const userNumber = req.user.phone;
    const { receiverNumber } = req.body;
    if (userNumber === receiverNumber) {
        return res.status(409).send("you can't add");
    }
    try {
        const receiverUser = await UserModel.findOne({
            phone: receiverNumber,
        });
        if (!receiverUser) throw new Error();
        const senderUser = await UserModel.findOne({
            phone: userNumber,
        }).populate({
            path: "contactList",
            select: "-_id phone",
        });
        const allContacts = senderUser.contactList.map(
            (contact) => contact.phone
        );
        const isAlreadyInContact = allContacts.find((value) => {
            return value == receiverNumber;
        });
        if (!isAlreadyInContact) {
            const senderUser = await UserModel.findOne({
                phone: userNumber,
            });

            // adding receiverUser_id in contact list
            senderUser.contactList.push(receiverUser._id);
            await senderUser.save();

            // check if the conversation document is present or not
            const isConversationPresent = await ConversationModel.findOne({
                participants: {
                    $all: [senderUser._id, receiverUser._id],
                },
            }).where("isGroupChat").equals(false);

            // add conversation between this two users if don't have
            if (!isConversationPresent) {
                // creating a conversation document
                const participants = [
                    new ObjectId(senderUser._id),
                    new ObjectId(receiverUser._id),
                ];
                const conversation = new ConversationModel({
                    participants,
                    isGroupChat: false,
                });
                await conversation.save();
            }

            return res.status(200).send("contact added successfull");
        } else {
            return res.status(409).send("all already exists");
        }
    } catch (error) {
        return res.status(404).send("not found");
    }
};

module.exports = addContact;
