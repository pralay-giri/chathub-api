const UserMOdel = require("../models/userModel");
const fs = require("fs");
const path = require("path");

const changeProfileControler = async (req, res) => {
    try {
        const updateProfileName = Date.now() + "-" + req.files.profile.name;
        const profileFolderPath = path.join(process.cwd(), "profiles");

        //update profile and return old document for further use
        const user = await UserMOdel.findOneAndUpdate(
            { phone: req.user.phone },
            { $set: { profile: updateProfileName } },
            { new: false }
        );

        if (!user) throw new Error("user not found");

        // deleting the file
        fs.unlink(path.join(profileFolderPath, user.profile), () => {});

        //uploading new profile photo
        req.files.profile.mv(path.join(profileFolderPath, updateProfileName));

        res.status(201).send("updated");
    } catch (error) {
        res.status(404).send(error.message);
    }
};

module.exports = changeProfileControler;
