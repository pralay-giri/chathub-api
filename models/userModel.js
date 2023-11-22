const mongoose = require("mongoose");
const validation = require("validator");

const defaultProfile =
    "https://www.pngitem.com/pimgs/m/146-1468281_profile-icon-png-transparent-profile-picture-icon-png.png";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validation.isMobilePhone(value, "en-IN");
            },
            message: "invalid phone number",
        },
    },
    gmail: {
        type: String,
        validate: {
            validator: function (value) {
                return validation.isEmail(value);
            },
            message: "invalid gmail",
        },
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        default: defaultProfile,
    },
    status: {
        type: String,
        default: "offline",
        enum: {
            values: ["online", "offline"],
            message: "{VALUE} is not supported",
        },
    },
    about: {
        type: String,
        default: "i am using chat hub",
    },
    lastActive: {
        type: Date,
        default: new Date(),
    },
    contactList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
        },
    ],
    groupList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupSchema",
        },
    ],
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
