import fs from "fs";

class ProductManager {
    constructor(path) {
        this.products = [];
        this.id = 1;
        this.path = path;
    }

    
    async addProduct({ title, category, description, price, urlImage, code, stock, thumbnails = [] }) {
        const arrayProducts = await this.readFile();

        if (!title || !category || !description || !price || !code || !stock) {
            throw new Error('Todos los campos deben ser completados para agregar el producto.');
        }
        if (arrayProducts.some(product => product.code === code)) {
            throw new Error("El código ya existe en otro producto. Por favor, ingrese un código diferente.");
        }

        const newId = arrayProducts.length > 0 ? arrayProducts[arrayProducts.length - 1].id + 1 : 1;
        const newProduct = {
            id: newId,
            title,
            category,
            description,
            price,
            urlImage,
            code,
            stock,
            status: true,
            thumbnails
        };

        arrayProducts.push(newProduct);
        await this.saveFile(arrayProducts);
        return newProduct
    }

    async getProducts() {
        try {
            const arrayProducts = await this.readFile();
            return arrayProducts;
        } catch (error) {
            console.error("No se pudo leer el archivo de productos", error);
        }
    }

    async getProductById(id) {
        const arrayProducts = await this.readFile();
        const product = arrayProducts.find(prod => prod.id === id);
        return product || null;
    }

    async readFile() {
        const file = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(file);
    }

    async saveFile(arrayProducts) {
        await fs.promises.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    }

    async updateProduct(id, updatedProduct) {
        const arrayProducts = await this.readFile();
        const index = arrayProducts.findIndex(item => item.id === id);

        if (index !== -1) {
            arrayProducts[index] = { ...arrayProducts[index], ...updatedProduct };
            await this.saveFile(arrayProducts);
        } else {
            throw new Error("No se encontró el producto");
        }
    }

    async deleteProduct(id) {
        const arrayProducts = await this.readFile();
        const index = arrayProducts.findIndex(product => product.id === id);

        if (index !== -1) {
            arrayProducts.splice(index, 1);
            await this.saveFile(arrayProducts);
        } else {
            throw new Error("No se encontró el producto");
        }
    }
}

export default ProductManager;
