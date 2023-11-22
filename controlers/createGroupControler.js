const ObjectId = require("mongoose").Types.ObjectId;
const UserModel = require("../models/userModel");
const ConversationModel = require("../models/conversationModel");
const GroupModel = require("../models/groupModel");
const path = require("path");

const createGroupControler = async (req, res) => {
    try {
        // configuring file
        const { profile } = req.files;
        const fileName = Date.now() + "-" + profile.name;

        const { groupName } = req.body;
        const numbers = req.body.numbers.split(",");
        const participants = [];

        // getting all the participants _id
        const ownUser = await UserModel.findOne({ _id: req.user.id }).select(
            "groupList"
        );
        participants.push(ownUser);

        console.log(numbers);
        for (const number of numbers) {
            const user = await UserModel.findOne({ phone: number }).select(
                "groupList"
            );
            participants.push(user);
        }
        const participantsPhone = participants.map(
            (participant) => participant._id
        );
        participantsPhone.push(ownUser._id);

        // creating the Conversation Model
        const newConversationModel = new ConversationModel({
            participants: participantsPhone,
            isGroupChat: true,
        });
        const conversationModelResponce = await newConversationModel.save();

        // creating new group
        const newGroupModel = new GroupModel({
            name: groupName,
            conversasionId: conversationModelResponce._id,
            admin: new ObjectId(req.user.id),
            profile: fileName
        });

        const responce = await newGroupModel.save();

        // adding group id to all the participant's users document
        for (let i = 0; i < participants.length; i++) {
            participants[i].groupList.push(new ObjectId(responce._id));
            await participants[i].save();
        }

        if (!responce) {
            throw new Error("can't create group");
        }

        // uploadding file
        profile.mv(path.join(process.cwd(), "groupProfiles", fileName));
        return res.status(201).send("group created successfull...");

    } catch (error) {
        console.log(error);
        return res.status(404).send(error);
    }
};

module.exports = createGroupControler;
