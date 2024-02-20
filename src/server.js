const server = require("./app");
const { Server } = require("socket.io");
const prisma = require("./models/prisma");
const { upload } = require("./utils/cloudinary-service");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});
const onlineUser = {};

io.use((socket, next) => {
    const userId = socket.handshake.auth.id;
    if (!userId) {
        return next(new Error("invalid username"));
    }
    socket.userId = userId;
    onlineUser[userId] = socket.id;
    next();
});

io.on("connection", (socket) => {
    const userId = socket.handshake.auth.id;

    socket.on("sendMessage", async (input) => {
        io.to(onlineUser[input?.receiverId]).emit("receiveMessage", input);
    });

    socket.on("sendFile", async (input) => {
        // let data = input.data;
        //let image = input.file;
        //let dataImage = image.replace(/^data:image\/(png|jpg);base64,/, "");
        console.log(input);
        // let fileName = "user" + userId + Date.now() + "image.png";
        try {
            const image = await upload(input.file);
            await prisma.chat.create({
                data: {
                    message: input.text,
                    requesterId: input.senderId,
                    receiverId: input.receiverId,
                    productId: input.productId,
                    image: image,
                },
            });
        } catch (err) {
            console.log(err);
        }
        io.to(onlineUser[input?.receiverId]).emit("receiveFile", input);
    });

    socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

    socket.on("disconnect", () => {
        delete onlineUser[socket.userId];
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
