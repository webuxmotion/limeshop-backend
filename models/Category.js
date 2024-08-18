const { Schema, model, models, Types } = require("mongoose");

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    parent: {
        type: Types.ObjectId,
        ref: 'Category'
    }
});

export const Category = models.Category || model('Category', CategorySchema);