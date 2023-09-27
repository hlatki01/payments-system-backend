import { Request, Response } from "express";
import { UserService } from "../../src/services/UserService";

const userService = new UserService();

class UserController {
  async auth(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const auth = await userService.auth({ email, password });
      res.json(auth);
    } catch (error) {
      console.error("Error in auth:", error);
      res.status(500).json({ error: "An error occurred during authentication." });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const { companyId } = req

      const newUser = await userService.create({ name, email, password, role, companyId });
      res.json(newUser);
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json({ error: "An error occurred while creating a user." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { userId, name, email, password, role } = req.body;
      const { companyId } = req

      const updatedUser = await userService.update({ userId, name, email, password, role, companyId });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).json({ error: "An error occurred while updating the user." });
    }
  }

  async one(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string;
      const user = await userService.one({ userId });
      res.json(user);
    } catch (error) {
      console.error("Error in one:", error);
      res.status(500).json({ error: "An error occurred while fetching the user." });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const user = await userService.me(userId);
      res.json(user);
    } catch (error) {
      console.error("Error in me:", error);
      res.status(500).json({ error: "An error occurred while fetching the user profile." });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const deletedUser = await userService.delete({ userId });
      res.json(deletedUser);
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({ error: "An error occurred while deleting the user." });
    }
  }
}

export { UserController };
