const UserModel = require("../../models/userModel");

const setOnlineToUser = async (id, status) => {
    try {
        let update;
        switch (status) {
            case "online":
                update = {
                    status,
                };
                break;
            case "offline":
                update = {
                    status,
                    lastActive: new Date(),
                };
        }

        const user = await UserModel.findOneAndUpdate(
            { _id: id },    
            { $set: update }
        );

        return user.contactList;
    } catch (error) {
        console.log(error);
    }
};

module.exports = setOnlineToUser;
