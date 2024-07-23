import express from "express";
import CartManager from "../controllers/carts-manager.js";


const router = express.Router();
const cartManager = new CartManager("./src/data/carts.json");

router.get("/", async (request, response) => {
    const limit = parseInt(request.query.limit);
    try {
        const carts = await cartManager.loadCarts();
        response.status(200).json(isNaN(limit) ? carts : carts.slice(0, limit));
    } catch (error) {
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:cid", async (request, response) => {
    let id = parseInt(request.params.cid);
    try {
        const searchCart = await cartManager.getCartById(id);
        response.status(searchCart ? 200 : 404).json(searchCart || { error: "¡Producto no encontrado!" });
    } catch (error) {
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/", async (request, response) => {
    const newCart = request.body;

    try {
        await cartManager.addCart(newCart);
        response.status(201).json({ message: "Carrito agregado correctamente" });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const cartUpdated = await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(200).json(cartUpdated.products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al ingresar un producto al carrito");
    }
});

export default router;
