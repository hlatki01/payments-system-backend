import { Request, Response } from "express";
import { CategoryService } from "../../src/services/CategoryService";

const categoryService = new CategoryService();

class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const { companyId } = req
      const newCategory = await categoryService.create({ name, companyId });
      res.json(newCategory);
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json({ error: "An error occurred while creating a category: " + error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { categoryId, name } = req.body;
      const updatedCategory = await categoryService.update({ categoryId, name });
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).json({ error: "An error occurred while updating the category." });
    }
  }

  async one(req: Request, res: Response) {
    try {
      const categoryId = req.query.categoryId as string;
      const category = await categoryService.one({ categoryId });
      res.json(category);
    } catch (error) {
      console.error("Error in one:", error);
      res.status(500).json({ error: "An error occurred while fetching the category." });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { categoryId } = req.body;
      const deletedCategory = await categoryService.delete({ categoryId });
      res.json(deletedCategory);
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({ error: "An error occurred while deleting the category." });
    }
  }
}

export { CategoryController };
