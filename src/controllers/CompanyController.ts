import { Request, Response } from "express";
import { CompanyService } from "../services/CompanyService";

const companyService = new CompanyService();

class CompanyController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, phone } = req.body;

      if (!req.file) {
        throw new Error("Please upload a file");
      }

      const { originalname, filename: logo } = req.file;

      const company = await companyService.create({
        name,
        email,
        phone,
        logo,
      });

      res.json(company);
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json({ error: "An error occurred while creating the company." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { companyId, name, email, phone } = req.body;

      if (!req.file) {
        throw new Error("Please upload a file");
      }

      const { originalname, filename: logo } = req.file;

      const company = await companyService.update({
        companyId,
        name,
        email,
        phone,
        logo,
      });

      res.json(company);
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).json({ error: "An error occurred while updating the company." });
    }
  }

  async one(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string;
      const company = await companyService.one({ companyId });
      res.json(company);
    } catch (error) {
      console.error("Error in one:", error);
      res.status(500).json({ error: "An error occurred while fetching the company." });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string;
      const company = await companyService.delete({ companyId });
      res.json(company);
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({ error: "An error occurred while deleting the company." });
    }
  }
}

export { CompanyController };
