import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js";
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

app.listen(PUERTO, () => {
    console.log(`escuchando en el puerto ${PUERTO}`)
});