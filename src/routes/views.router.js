import { Router } from "express";
import ProductManager from "../dao/db/products-manager-db.js";

const router = Router();
const productManager = new ProductManager();

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
});

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 4 } = req.query;

        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
        });

        const nuevoArray = products.docs.map((product) => {
            const { _id, ...rest } = product.toObject();
            return rest;
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


export default router;