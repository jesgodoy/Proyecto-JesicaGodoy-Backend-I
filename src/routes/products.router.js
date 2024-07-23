import express from "express";
import ProductManager from "../controllers/products-manager.js";

const router = express.Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (request, response) => {
    let limit = parseInt(request.query.limit);
    try {
        const products = await productManager.getProducts();
        response.status(200).json(isNaN(limit) ? products : products.slice(0, limit));
    } catch (error) {
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:pid", async (request, response) => {
    let id = parseInt(request.params.pid);
    try {
        const searchProduct = await productManager.getProductById(id);
        response.status(searchProduct ? 200 : 404).json(searchProduct || { error: "¡Producto no encontrado!" });
    } catch (error) {
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/", async (request, response) => {
    const newProduct = request.body;
    try {
        const addedProduct = await productManager.addProduct(newProduct);
        response.status(201).json({
            message: "Producto agregado correctamente",
            product: addedProduct
        });
    } catch (error) {
        if (error.message === "Todos los campos deben ser completados para agregar el producto.") {
            response.status(400).json({ error: "Falta un dato obligatorio", message:"recuerde que los campos title, category, description, price, urlImage, code y stock son obligarorios" });
        } else if (error.message === "El código ya existe en otro producto. Por favor, ingrese un código diferente.") {
            response.status(400).json({ error: "Código ya existente en otro producto" });
        } else {
            response.status(500).json({ error: "Error interno del servidor" });
        }
    }
});

router.put("/:pid", async (request, response) => {
    const id = parseInt(request.params.pid);
    const updatedProduct = request.body;

    try {
        await productManager.updateProduct(id, updatedProduct);
        const product = await productManager.getProductById(id);
        response.status(200).json({
            message: "Producto se ha actualizado correctamente",
            product: product
        });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

router.delete("/:pid", async (request, response) => {
    const id = parseInt(request.params.pid);
    
    try {
        await productManager.deleteProduct(id);
        response.status(200).json({ message: "El producto se ha eliminado correctamente" });
    } catch (error) {
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;