import fs from "fs";

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async loadCarts() {
        try {
            const arrayCarts = await this.readFile();
            return arrayCarts;
        } catch (error) {
            console.error("No se pudo leer el archivo", error);
        }
    }

    async readFile() {
        const fileCarts = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(fileCarts);
    }

    async getCartById(id) {
        const carts = await this.loadCarts();
        const cart = carts.find(cart => cart.id === id);
        return cart || null;
    }

    async addCart() {
        const arrayCarts = await this.readFile();
        const newId = arrayCarts.length > 0 ? arrayCarts[arrayCarts.length - 1].id + 1 : 1;
        const newCart = {
            id: newId,
            products: []
        };

        arrayCarts.push(newCart);
        await this.saveFile(arrayCarts);
        return newCart;
    }

    async saveFile(arrayCarts) {
        await fs.promises.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
    }

    async addProductToCart(id, productId, quantity = 1) {
        const carts = await this.loadCarts();
        const cart = carts.find(cart => cart.id === id);

        if (!cart) {
            throw new Error("Cart not found");
        }

        const existingProduct = cart.products.find(prod => prod.product === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveFile(carts);
        return cart;
    }
}

export default CartManager;
