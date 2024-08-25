import ProductModel from '../models/product.model.js';


class ProductManager {

    async addProduct({ title, category, description, price, img, code, stock, thumbnails = [] }) {
        try {
            if (!title || !category || !description || !img || !price || !code || !stock) {
                throw new Error('Todos los campos deben ser completados para agregar el producto.');
            }
            const existingProduct = await ProductModel.findOne({ code });
            if (existingProduct) {
                throw new Error("El código del producto ya existe. Por favor, ingrese un código diferente.");
            }
    
            const newProduct = new ProductModel({
                title,
                category,
                description,
                img,
                price,
                code,
                stock,
                status: true,
                thumbnails
            });
    
            await newProduct.save();

            return newProduct;
        
        } catch (error) {
            console.error('Error al agregar el producto:', error.message);
            throw error;
        }
    }

    async getProducts({ limit = 15, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions.category = query;
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error getting products", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await ProductModel.findById(id)
        } catch (error) {
            console.error("No se pudo encontrar el producto", error);
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, updatedProduct, { new: true });
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            console.error("No se pudo actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const result = await ProductModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error("Producto no encontrado");
            }
            return result;
        } catch (error) {
            console.error("No se pudo eliminar el producto", error);
            throw error;
        }
    }
    

}

export default ProductManager;