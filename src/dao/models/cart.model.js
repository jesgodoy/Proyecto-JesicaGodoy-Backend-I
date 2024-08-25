import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
            },
        }
    ],
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;