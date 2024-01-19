const prisma = require("../models/prisma");

exports.categories = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const categories = await prisma.category.findFirst({
            where: {
                id: +categoryId,
            },
        });

        if (!categories) {
            return next(createError("Category is not found", 404));
        }

        res.status(200).json({ categories });
    } catch (err) {
        next(err);
    }
};

exports.allCategories = async (req, res, next) => {
    try {
        const allCategory = await prisma.category.findMany();

        if (!allCategory) {
            return next(createError("Category is not found", 404));
        }

        res.status(200).json({ allCategory });
    } catch (err) {
        next(err);
    }
};
