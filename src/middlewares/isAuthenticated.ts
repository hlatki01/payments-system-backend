import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import prismaClient from "../prisma";

interface Payload {
  sub: string;
}

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Receive the token
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(401).json({ code: 401, error: "Unauthorized" });
    }

    const [, token] = authToken.split(" ");

    // Validate the token
    const { sub } = verify(token, process.env.JWT_SECRET) as Payload;

    // Retrieve the user information
    const user = await prismaClient.user.findFirst({
      where: {
        id: sub,
      },
    });

    if (!user) {
      return res.status(401).json({ code: 401, error: "Unauthorized" });
    }

    // Store user and company information in request object
    req.userId = sub;
    req.companyId = user.companyId;

    // Continue processing
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, error: "Unauthorized" });
  }
}
