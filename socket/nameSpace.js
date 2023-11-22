const jwt = require("jsonwebtoken");
require("dotenv").config();
const toogleOnlineOffline = require("./cb/toogleOnlineOffline");
const getConverstionId = require("./cb/getConverstionId");

const isAuthUser = (token) => {
    try {
        token = token.split(" ")[1];
        let user;
        jwt.verify(token, process.env.JWTPRIVATE, (err, data) => {
            if (!err) {
                user = data;
                return;
            }
            user = false;
        });
        return user;
    } catch (error) {
        return false;
    }
};

const namespace = (io) => {
    // meddlewire for socket
    io.use((socket, next) => {
        const user = isAuthUser(socket.handshake.auth.token);
        if (user) {
            socket.user = user;
            next();
        } else {
            next(new Error("no token found"));
        }
    });

    io.on("connection", (socket) => {
        socket.on("set-up", async () => {
            socket.join(socket.user.id);
            const contactList = await toogleOnlineOffline(
                socket.user.id,
                "online"
            );
            contactList.forEach((contact) => {
                socket.to(contact.toString()).emit("online", socket.user.id);
            });
            const converSationIds = await getConverstionId(socket.user.id);
            converSationIds.forEach((converSationId) => {
                socket.join(converSationId._id.toString());
            });
        });

        socket.on("join-chat", (room) => {
            socket.join(room);
        });

        socket.on("new-message", (message) => {
            socket
                .to(message.conversationId)
                .emit("new-message-received", message);
        });

        socket.on("disconnect", async () => {
            const contactList = await toogleOnlineOffline(
                socket.user.id,
                "offline"
            );
            contactList.forEach((contact) => {
                socket.to(contact.toString()).emit("offline", socket.user.id);
            });
        });
    });
};

module.exports = namespace;
