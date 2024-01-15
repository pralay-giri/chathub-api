const ObjectId = require("mongoose").Types.ObjectId;
const UserModel = require("../models/userModel");
const ConversationModel = require("../models/conversationModel");
const GroupModel = require("../models/groupModel");
const path = require("path");

const createGroupControler = async (req, res) => {
    try {
        const { groupName, contacts } = req.body;
        // its store all the users
        const participantsUserInfo = [];

        // getting all the user data who join the group
        const admin = await UserModel.findOne({ _id: req.user.id }).select(
            "groupList"
        );
        participantsUserInfo.push(admin);

        for (let i = 0; i < contacts.length; i++) {
            const user = await UserModel.findOne({
                _id: contacts[i]._id,
            }).select("groupList");
            if (user) participantsUserInfo.push(user);
        }

        console.log(participantsUserInfo);
        const participantIds = participantsUserInfo.filter((participant) => {
            return participant._id !== req.user.id;
        });

        // creating the Conversation Model
        const newConversationModel = new ConversationModel({
            participants: participantIds,
            isGroupChat: true,
        });
        const conversationModelResponce = await newConversationModel.save();

        // creating new group
        const newGroupModel = new GroupModel({
            name: groupName,
            conversasionId: conversationModelResponce._id,
            admin: new ObjectId(req.user.id),
        });

        const group = await newGroupModel.save();
        if (!group) {
            throw new Error("can't create group");
        }

        // adding group id to all the participant's users document
        for (let i = 0; i < participantsUserInfo.length; i++) {
            participantsUserInfo[i].groupList.push(new ObjectId(group._id));
            await participantsUserInfo[i].save();
        }

        return res.status(201).send("group created");
    } catch (error) {
        return res.status(404).send(error);
    }
};

module.exports = createGroupControler;
