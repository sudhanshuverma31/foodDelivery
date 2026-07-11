import mangoose from "mongoose";

const itemSchema = new mangoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    shop: { type: mangoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
     foodType: { type: String,
        enum: ['Vegetarian', 'Non-Vegetarian'],
        required: true },
    category: { type: String,
        enum:['pizza', 'burger', 'pasta', 'salad', 'dessert', 'beverage', 'appetizer', 'main course', 'side dish','fast food', 'seafood', 'soup', 'sandwich', 'breakfast', 'lunch', 'dinner', 'snack', 'grill', 'barbecue', 'taco', 'burrito', 'wrap', 'noodles', 'rice dish', 'curry', 'stir fry', 'dumpling'],
        required: true },
    price: { type: Number, 
        min: 0,
        required: true },
    createdAt: { type: Date, default: Date.now }
},{
    timestamps: true
})

export const ItemModel = mangoose.model('Item', itemSchema);