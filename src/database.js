import mongoose from "mongoose";

mongoose.connect("mongodb+srv://jesigodoyprogramacion:Coderbackend@cluster0.4rbfc.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectados a la BD correctamente"))
    .catch(() => console.log("Error no pudimos conectarnos a la BD"))