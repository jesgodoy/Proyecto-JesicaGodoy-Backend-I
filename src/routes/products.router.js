import express from 'express';
import ProductManager from '../dao/db/products-manager-db.js'; 

const router = express.Router();
const productManager = new ProductManager(); 

router.get("/", async (req, res) => {
    try {
        const { limit = 100, page = 1, sort, query } = req.query;

        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error getting products", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server error"
        });
    }
});

router.get('/:pid', async (req, res) => {
    const id = req.params.pid; 
    try {
        const searchProduct = await productManager.getProductById(id);
        res.status(searchProduct ? 200 : 404).json(searchProduct || { error: "¡Producto no encontrado!" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post('/', async (req, res) => {
    const newProduct = req.body;
    try {
        const addedProduct = await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Producto agregado correctamente",
            product: addedProduct
        });
    } catch (error) {
        if (error.message === "Todos los campos deben ser completados para agregar el producto.") {
            res.status(400).json({ error: "Falta un dato obligatorio", message: "Recuerde que los campos title, category, description, price, img, code y stock son obligatorios." });
        } else if (error.message === "El código del producto ya existe. Por favor, ingrese un código diferente.") {
            res.status(400).json({ error: "Código ya existente en otro producto" });
        } else {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
});

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        const updated = await productManager.updateProduct(id, updatedProduct);
        res.status(200).json({
            message: "Producto se ha actualizado correctamente",
            product: updated
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid; 

    try {
        const result = await productManager.deleteProduct(id);
        res.status(200).json({ message: "El producto se ha eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;