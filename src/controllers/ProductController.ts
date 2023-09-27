
import { Request, Response } from "express";
import { ProductService } from "../../src/services/ProductService";

const productService = new ProductService();

class ProductController {
    async create(req: Request, res: Response) {
        try {
            const { name, description, price, categoryId } = req.body;
            const { companyId } = req

            const newProduct = await productService.create({ name, description, price, companyId, categoryId });
            res.json(newProduct);
        } catch (error) {
            console.error("Error in create:", error);
            res.status(500).json({ error: "An error occurred while creating a product." });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { productId, name, description, price } = req.body;
            const updatedProduct = await productService.update({ productId, name, description, price });
            res.json(updatedProduct);
        } catch (error) {
            console.error("Error in update:", error);
            res.status(500).json({ error: "An error occurred while updating the product." });
        }
    }

    async one(req: Request, res: Response) {
        try {
            const productId = req.query.productId as string;
            const product = await productService.one({ productId });
            res.json(product);
        } catch (error) {
            console.error("Error in one:", error);
            res.status(500).json({ error: "An error occurred while fetching the product." });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { productId } = req.body;
            const deletedProduct = await productService.delete({ productId });
            res.json(deletedProduct);
        } catch (error) {
            console.error("Error in delete:", error);
            res.status(500).json({ error: "An error occurred while deleting the product." });
        }
    }
}

export { ProductController };
