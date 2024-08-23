import CartModel from "../models/cart.model.js";

class CartManager {
    async addCart() {
        try {
            const newCarrito = new CartModel({ cart: [] });
            await newCarrito.save();
            return newCarrito;
        } catch (error) {
            console.error("Error al crear un carrito de compras:", error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id)
                .populate({
                    path: 'cart.product',
                    select: 'id'
                });
            return cart || null;
        } catch (error) {
            console.error("Error al obtener el carrito por id:", error);
            throw error;
        }
    }

    async addProductToCart(id, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(id);
            if (!cart) {
                throw new Error("Carrito no encontrado"); 
            }

            const existingProduct = cart.cart.find(prod => prod.product._id.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.cart.push({ product: productId, quantity });
            }

            cart.markModified("cart");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar un producto al carrito:", error);
            throw error;
        }
    }

    async getAllCarts() {
        try {
            return await CartModel.find()
                .populate({
                    path: 'cart.product',
                    select: 'id title price code'
                });
        } catch (error) {
            console.error("Error al obtener todos los carritos:", error);
            throw error;
        }
    }

    async deleteCartById(id) {
        try {
            const result = await CartModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error("Carrito no encontrado");
            }
            return result;
        } catch (error) {
            console.error("Error al eliminar el carrito por id:", error);
            throw error;
        }
    }

}

export default CartManager;