import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === "GET") {
        res.json(await Category.find().populate('parent'));
    }

    if (method === "POST") {
        const { name, parentCategory } = req.body;

        const categoryDoc = await Category.create({ 
            name, 
            parent: parentCategory 
        });

        res.json(categoryDoc);
    }

    if (method === "PUT") {
        const { _id, name, parentCategory } = req.body;

        const updatedInfo = await Category.updateOne(
            { _id }, 
            { 
                name,
                parent: parentCategory || null
            },
            { runValidators: true }
        );

        res.json(updatedInfo);
    }
}