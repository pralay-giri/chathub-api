const { Schema, model } = require("mongoose");
const defaultProfile =
    "https://www.pngitem.com/pimgs/m/146-1468281_profile-icon-png-transparent-profile-picture-icon-png.png";

const groupSchema = Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
    },
    conversasionId: {
        type: Schema.Types.ObjectId,
        ref: "ConversationModel",
    },
    profile: {
        type: String,
        required: true,
        default: defaultProfile,
    },
    admin: [
        {
            type: Schema.Types.ObjectId,
            ref: "UserModel",
            required: true,
        },
    ],
});

const GroupSchema = model("GroupSchema", groupSchema);

module.exports = GroupSchema;
