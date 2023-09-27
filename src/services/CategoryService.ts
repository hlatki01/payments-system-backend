
import prismaClient from "../prisma";

interface CategoryRequest {
    categoryId?: string;
    name?: string;
    companyId?: string;
}

class CategoryService {
    async create({ name, companyId }: CategoryRequest) {
        try {
            if (!name || !companyId) {
                throw new Error("Category name and company ID are mandatory");
            }

            const categoryAlreadyExists = await prismaClient.category.findFirst({
                where: {
                    name: name,
                    companyId: companyId,
                },
            });

            if (categoryAlreadyExists) {
                throw new Error("Category already exists for this company");
            }

            const category = await prismaClient.category.create({
                data: {
                    name: name,
                    company: { connect: { id: companyId } }
                },
            });

            return category;
        } catch (error) {
            throw new Error(`Category creation failed: ${error.message}`);
        }
    }

    async update({ categoryId, name }: CategoryRequest) {
        try {
            if (!categoryId || !name) {
                throw new Error("Category ID and name are mandatory");
            }

            const category = await prismaClient.category.update({
                data: {
                    name: name,
                },
                where: {
                    id: categoryId,
                },
            });

            return category;
        } catch (error) {
            throw new Error(`Category update failed: ${error.message}`);
        }
    }

    async one({ categoryId }: CategoryRequest) {
        try {
            const category = await prismaClient.category.findFirst({
                where: {
                    id: categoryId,
                },
            });

            if (!category) {
                throw new Error("Category not found");
            }

            return category;
        } catch (error) {
            throw new Error(`Fetching category failed: ${error.message}`);
        }
    }

    async delete({ categoryId }: CategoryRequest) {
        try {
            const category = await prismaClient.category.update({
                where: {
                    id: categoryId,
                },
                data: {
                    deleted: true,
                },
            });

            if (!category) {
                throw new Error("Category not found");
            }

            return category;
        } catch (error) {
            throw new Error(`Category deletion failed: ${error.message}`);
        }
    }
}

export { CategoryService };
