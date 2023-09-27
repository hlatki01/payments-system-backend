import prismaClient from "../prisma";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
  email: string;
  password: string;
}

enum Roles {
  ADMIN,
  USER,
}

interface UserRequest {
  userId?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Roles;
  companyId?: string;
}

class UserService {
  async auth({ email, password }: AuthRequest) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new Error("User/password incorrect");
      }

      if (user.deleted) {
        throw new Error("Your user was deleted, contact support.");
      }

      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("User/password incorrect");
      }

      const token = sign(
        {
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: "30d",
        }
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token,
        company: user.companyId,
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async create({ name, email, password, role, companyId }: UserRequest) {
    try {
      if (!name || !email || !password || !companyId) {
        throw new Error("All fields are mandatory");
      }

      const userAlreadyExists = await prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });

      if (userAlreadyExists) {
        throw new Error("User already exists");
      }

      const passwordHash = await hash(password, 8);

      const user = await prismaClient.user.create({
        data: {
          name: name,
          email: email,
          password: passwordHash,
          company: { connect: { id: companyId } },
        },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  async update({
    userId,
    name,
    email,
    password,
    role,
    companyId,
  }: UserRequest) {
    try {
      if (!email) {
        throw new Error("Email incorrect");
      }

      const userAlreadyExists = await prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });

      const getUserInfo = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (userAlreadyExists && userAlreadyExists.id !== getUserInfo.id) {
        throw new Error("User already exists");
      }

      const passwordHash = await hash(password, 8);

      const user = await prismaClient.user.update({
        data: {
          name: name,
          email: email,
          password: passwordHash,
          company: { connect: { id: companyId } },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        where: {
          id: userId,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`User update failed: ${error.message}`);
    }
  }

  async one({ userId }: UserRequest) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id: userId,
          deleted: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          deleted: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(`Fetching user failed: ${error.message}`);
    }
  }

  async delete({ userId }: UserRequest) {
    try {
      const user = await prismaClient.user.update({
        data: {
          deleted: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(`User deletion failed: ${error.message}`);
    }
  }

  async me(userId: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(`Fetching user profile failed: ${error.message}`);
    }
  }
}

export { UserService };
