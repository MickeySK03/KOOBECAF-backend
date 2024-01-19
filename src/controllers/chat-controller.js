const prisma = require("../models/prisma");

exports.addMessage = async (req, res, next) => {
    try {
        const data = req.body;
        await prisma.chat.create({
            data: {
                message: data.text,
                requesterId: data.senderId,
                receiverId: data.receiverId,
                productId: data.productId,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllChatByUserId = async (req, res, next) => {
    try {
        const { productId, receiverId } = req.params;
        const message = await prisma.chat.findMany({
            where: {
                OR: [
                    { receiverId: +receiverId, requesterId: req.user.id },
                    { receiverId: req.user.id, requesterId: +receiverId },
                ],
                productId: +productId,
            },
            include: {
                receiver: true,
                requester: true,
            },
        });

        res.status(200).json({ message });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.getInboxBuy = async (req, res, next) => {
    try {
        const mess = await prisma.chat.findMany({
            where: {
                OR: [{ receiverId: req.user.id }, { requesterId: req.user.id }],
            },
            include: {
                productsId: {
                    include: {
                        image: true,
                    },
                },
            },
        });

        const chatRoomsMap = new Map();

        for (const chat of mess) {
            const productId = chat.productId;

            const otherUserId = chat.receiverId === req.user.id ? chat.requesterId : chat.receiverId;

            const key = `${req.user.id}_${otherUserId}_${productId}`;

            const buyer = await prisma.user.findFirst({
                where: { id: otherUserId },
            });

            chatRoomsMap.set(key, {
                seller: req.user.id,
                buyer,
                product: chat.productsId,
            });
        }

        const getInbox = Array.from(chatRoomsMap.values());

        res.status(200).json({ getInbox });
    } catch (err) {
        next(err);
    }
};
