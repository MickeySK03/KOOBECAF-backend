const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const DOMAIN = process.env.DOMAIN;

exports.payment = async (req, res, next) => {
    try {
        const { lookup_key } = req.body;
        const prices = await stripe.prices.list({
            lookup_keys: [lookup_key],
            expand: ["data.product"],
        });

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: "auto",
            line_items: [
                {
                    price: prices.data[0].id,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${DOMAIN}/paymentSuccessful?success=true&transactionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN}/paymentFailed?canceled=true`,
        });
        res.status(200).json({ url: session.url });
    } catch (err) {
        next(err);
    }
};

exports.createSubscribe = async (req, res, next) => {
    try {
        const { transactionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(transactionId);

        if (!session) {
            return next(createError("Error"), 400);
        }

        const price = session.amount_total / 100;
        let currentDate = new Date();
        let startSubscribe = currentDate;
        let endSubscribe = new Date(currentDate);
        if (price === 159) {
            endSubscribe.setMonth(currentDate.getMonth() + 1);
        } else {
            endSubscribe.setMonth(currentDate.getMonth() + 12);
        }

        await prisma.user.update({
            where: {
                id: +req.user.id,
            },
            data: {
                isSubscribe: true,
                startSubscribe: startSubscribe,
                endSubscribe: endSubscribe,
            },
        });

        await prisma.product.updateMany({
            where: {
                userId: +req.user.id,
            },
            data: {
                point: 5,
            },
        });

        res.status(201).json({ session });
    } catch (error) {
        next(error);
    }
};
