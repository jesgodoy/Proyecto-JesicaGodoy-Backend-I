import express from "express";
import { engine } from "express-handlebars";
import { Server} from "socket.io";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./controllers/products-manager.js";

const app = express()
const PUERTO = 8080;

app.use(express.json());
app.use(express.static("./src/public"));

app.engine("handlebars",engine())
app.set("view engine", "handlebars");
app.set("views", "./src/views"); 

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const productManager = new ProductManager("./src/data/products.json")

const httpServer = app.listen(PUERTO, () => {
    console.log(`escuchando en el puerto ${PUERTO}`)
});

const io = new Server(httpServer); 

io.on("connection", async(socket)=>{
    console.log("Un cliente se conectó");

    socket.emit("allProducts", await productManager.getProducts());
    
    socket.on("addProductsIo", async (newProductIo) => {
        try {
            await productManager.addProduct(newProductIo);
            io.emit("allProducts", await productManager.getProducts());
            socket.emit("addProductsResponse", { success: true });

        }catch(error){
            console.error("Error al agregar el producto:", error);
            socket.emit("addProductsResponse", { success: false, errorMessage: error.message });
        }
    });

    socket.on('deleteProduct', async(productId) => {
       
        try {
            await productManager.deleteProduct(parseInt(productId))
            io.emit("allProducts", await productManager.getProducts());
            socket.emit("deleteProductResponse", { success: true });

        }catch(error){
            console.error("Error al eliminar el producto:", error);
            socket.emit("deleteProductReseponse", { success: false, errorMessage: error.message });
        }
    });

});