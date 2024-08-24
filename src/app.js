
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./dao/db/products-manager-db.js";
import "./database.js"; 


const app = express();
const PUERTO = 8080;


app.use(express.json()); 
app.use(express.static("./src/public")); 


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`);
});


const io = new Server(httpServer);
const productManager = new ProductManager();

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    try {
        const products = await productManager.getProducts();
        socket.emit("allProducts", products.docs);
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }

    socket.on("addProductsIo", async (newProductIo) => {
        try {
            await productManager.addProduct({
                title: newProductIo.title,
                category: newProductIo.category,
                description: newProductIo.description,
                price: newProductIo.price,
                img: newProductIo.urlImage,
                code: newProductIo.code,
                stock: newProductIo.stock
            });

            const products = await productManager.getProducts();
            io.emit("allProducts", products.docs);
            socket.emit("addProductsResponse", { success: true });
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            socket.emit("addProductsResponse", { success: false, errorMessage: error.message });
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const products = await productManager.getProducts();
            io.emit("allProducts", products.docs);
            socket.emit("deleteProductResponse", { success: true });
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            socket.emit("deleteProductResponse", { success: false, errorMessage: error.message });
        }
    });
});