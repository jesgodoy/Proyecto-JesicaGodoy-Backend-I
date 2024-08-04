import { Router } from "express";
import ProductManager from "../controllers/products-manager.js";

const router = Router();

const productManager = new ProductManager("./src/data/products.json");

router.get("/realtimeproducts", async(req,res)=>{
    res.render("realtimeproducts")
})


router.get("/products", async(req, res)=>{
    const products =await productManager.getProducts()
    res.render("home", {products});
});


export default router