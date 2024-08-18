import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === "GET") {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query?.id }));
            return;
        }

        res.json(await Product.find());
    }

    if (method === "POST") {
        const { title, description, price, images, category } = req.body;
        const productDoc = await Product.create({
            title,
            category,
            description,
            price,
            images
        });

        res.json(productDoc);
    }

    if (method === "PUT") {
        const { _id, title, description, price, images, category } = req.body;

        const updatedInfo = await Product.updateOne(
            { _id }, 
            { title, description, price, images, category },
            { runValidators: true }
        );

        res.json(updatedInfo);
    }

    if (method === "DELETE") {
        if (req.query?.id) {
            res.json(await Product.deleteOne({ _id: req.query?.id }));
            return;
        }

        res.json({
            deleted: true
        });
    }
}