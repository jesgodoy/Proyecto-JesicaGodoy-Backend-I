import { Router } from "express";
import ProductManager from "../dao/db/products-manager-db.js";
import CartManager from "../dao/db/carts-manager-db.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 4 } = req.query;

        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
        });

        const nuevoArray = products.docs.map((product) => {
            return product.toObject();
        });

        res.render("home", {
            productos: nuevoArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
        });

    } catch (error) {
        console.error("Error al obtener los productos", error);
        res.status(500).json({
            status: "error",
            error: "Error Interno del Servidor",
        });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        const processedCart = {
            _id: cart._id.toString(),
            cart: cart.cart.map(item => ({
                productId: item.product._id.toString(),
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                _id: item._id.toString()
            }))
        };

        res.render('cart', {
            cart: processedCart
        });

    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).render('error', { message: 'Error al obtener el carrito' });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);

        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }

        res.render('product', {
            product: product.toObject()
        });

    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).render('error', { message: 'Error al obtener el producto' });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
});

export default router;