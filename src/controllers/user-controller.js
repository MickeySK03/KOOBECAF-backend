const { upload } = require("../utils/cloudinary-service");
const prisma = require("../models/prisma");
const fs = require("fs/promises");
const { checkUserIdSchema } = require("../validators/user-validator");
const createError = require("../utils/create-error");

exports.updateProfile = async (req, res, next) => {
    try {
        const data = req.body;

        const response = {};

        if (data) {
            await prisma.user.update({
                data: { firstName: data.firstName, lastName: data.lastName },
                where: {
                    id: req.user.id,
                },
            });
        }

        if (req.files.profileImage) {
            const url = await upload(req.files.profileImage[0].path);
            response.profileImage = url;
            await prisma.user.update({
                data: {
                    profileImage: url,
                },
                where: {
                    id: req.user.id,
                },
            });
        }

        if (req.files.coverImage) {
            const url = await upload(req.files.coverImage[0].path);
            response.coverImage = url;
            await prisma.user.update({
                data: {
                    coverImage: url,
                },
                where: {
                    id: req.user.id,
                },
            });
        }

        res.status(200).json({ message: "Update success" });
    } catch (err) {
        next(err);
    } finally {
        if (req.files?.profileImage) {
            fs.unlink(req.files.profileImage[0].path);
        }
        if (req.files?.coverImage) {
            fs.unlink(req.files.coverImage[0].path);
        }
    }
};

exports.getProfileByUserId = async (req, res, next) => {
    try {
        const { value, error } = checkUserIdSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        const profile = await prisma.user.findFirst({
            where: {
                id: +value.userId,
            },
        });

        if (!profile) {
            return next(createError("Profile is not found", 404));
        }

        delete profile.password;

        res.status(200).json({ profile });
    } catch (err) {
        next(err);
    }
};

exports.unSubscribe = async (req, res, next) => {
    try {
        await prisma.user.update({
            data: { isSubscribe: false },
            where: {
                id: req.user.id,
            },
        });

        await prisma.product.updateMany({
            where: {
                userId: req.user.id,
            },
            data: {
                point: 0,
            },
        });

        res.status(200).json({ message: "Unsubscribe success" });
    } catch (err) {
        next(err);
    }
};
