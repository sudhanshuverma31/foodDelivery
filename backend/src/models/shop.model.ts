import mangoose from "mongoose";

const shopSchema = new mangoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    owner: { type: mangoose.Schema.Types.ObjectId, ref: 'User', required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true }, 
    category: { type: String, 
        enum: ['Fast Food', 'Casual Dining', 'Fine Dining', 'Cafe', 'Buffet', 'Food Truck', 'Bakery', 'Bar', 'Pub', 'Lounge', 'Deli', 'Pizzeria', 'Steakhouse', 'Seafood Restaurant', 'Vegetarian Restaurant', 'Vegan Restaurant'],
        required: true },
    items: [{ type: mangoose.Schema.Types.ObjectId, ref: 'Item' }],
    createdAt: { type: Date, default: Date.now }
},{
    timestamps: true
})

export const ShopModel = mangoose.model('Shop', shopSchema);
