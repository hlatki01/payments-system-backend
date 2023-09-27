import prismaClient from "../prisma";

interface ProductRequest {
    productId?: string;
    name?: string;
    description?: string;
    price?: number;
    companyId?: string;
    categoryId?: string;
}

class ProductService {
    async create({ name, description, price, companyId, categoryId }: ProductRequest) {
        try {
            if (!name || !companyId || !categoryId) {
                throw new Error("Name, company ID, and category ID are mandatory");
            }

            const productAlreadyExists = await prismaClient.product.findFirst({
                where: {
                    name: name,
                    companyId: companyId,
                    categoryId: categoryId,
                },
            });

            if (productAlreadyExists) {
                throw new Error("Product already exists for this company and category");
            }

            const product = await prismaClient.product.create({
                data: {
                    name: name,
                    description: description,
                    price: price,
                    company: { connect: { id: companyId } }, // Connect the product to the company
                    category: { connect: { id: categoryId } },
                },
            });

            return product;
        } catch (error) {
            throw new Error(`Product creation failed: ${error.message}`);
        }
    }

    async update({ productId, name, description, price }: ProductRequest) {
        try {
            if (!productId || !name || !price) {
                throw new Error("Product ID, name, and price are mandatory");
            }

            const product = await prismaClient.product.update({
                data: {
                    name: name,
                    description: description,
                    price: price,
                },
                where: {
                    id: productId,
                },
            });

            return product;
        } catch (error) {
            throw new Error(`Product update failed: ${error.message}`);
        }
    }

    async one({ productId }: ProductRequest) {
        try {
            const product = await prismaClient.product.findFirst({
                where: {
                    id: productId,
                },
            });

            if (!product) {
                throw new Error("Product not found");
            }

            return product;
        } catch (error) {
            throw new Error(`Fetching product failed: ${error.message}`);
        }
    }

    async delete({ productId }: ProductRequest) {
        try {
            const product = await prismaClient.product.update({
                where: {
                    id: productId,
                },
                data: {
                    deleted: true,
                },
            });

            if (!product) {
                throw new Error("Product not found");
            }

            return product;
        } catch (error) {
            throw new Error(`Product deletion failed: ${error.message}`);
        }
    }
}

export { ProductService };
