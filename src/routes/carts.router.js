import express from "express";
import CartManager from "../dao/db/carts-manager-db.js";

const router = express.Router();
const cartManager = new CartManager();

router.get("/", async (request, response) => {
    const limit = parseInt(request.query.limit);
    try {
        const carts = await cartManager.getAllCarts();
        response.status(200).json(isNaN(limit) ? carts : carts.slice(0, limit));
    } catch (error) {
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/", async (request, response) => {
    try {
        const newCart = await cartManager.addCart();
        response.status(201).json({
            message: "Carrito agregado correctamente",
            cart: newCart
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Error interno del servidor" });
    }
});


router.get("/:cid", async (request, response) => {
    let id = request.params.cid;
    try {
        const searchCart = await cartManager.getCartById(id);
        response.status(searchCart ? 200 : 404).json(searchCart || { error: "¡Carrito no encontrado!" });
    } catch (error) {
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete("/:cid", async (request, response) => {
    const cartId = request.params.cid;
    try {
        const deletedCart = await cartManager.deleteCartById(cartId);
        response.status(200).json({ message: "Carrito eliminado correctamente" });
    } catch (error) {
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {

        const cartUpdated = await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(200).json(cartUpdated);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al ingresar un producto al carrito");
    }
});




export default router;