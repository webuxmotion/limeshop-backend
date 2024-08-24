const { Schema, model, models, Types } = require("mongoose");

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: Types.ObjectId,
        ref: 'Category'
    },
    images: [
        {
            type: String
        }
    ],
    properties: {
        type: Object
    }
}, {
    timestamps: true
});

export const Product = models.Product || model('Product', ProductSchema);