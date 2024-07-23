import express from "express";
import productsRouter from "./routes/products.router.js"


const app = express()
const PUERTO = 8080;

app.use(express.json());



app.use("/api/products", productsRouter)
//app.use("/api/carts", cartsRouter)

app.listen(PUERTO,()=>{
    console.log(`escuchando en el puerto ${PUERTO}`)
})