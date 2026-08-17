import mangoose from "mongoose";

const itemSchema = new mangoose.Schema({
    name: { type: String, required: true },
    //description: { type: String, required: true },
    image: { type: String, required: true },
    shop: { type: mangoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    foodType: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
        required: true
    },
    category: {
        type: String,
        enum: [
            'Starters',
            'Main Course',
            'Snacks',
            'Breakfast',
            'Lunch',
            'Dinner',
            'Beverages',
            'Desserts',
            'Salads',
            'Street Food'
        ],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
})

export const ItemModel = mangoose.model('Item', itemSchema);