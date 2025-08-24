import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import User, { EnumRoles, IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface TokenPayload extends JwtPayload {
  id: string;
}

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: "No Autorizado" });
  }
  const token = match[1];

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET no está definido");
    return res
      .status(500)
      .json({ error: "Error de configuración del servidor" });
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Token no válido" });
    }

    const user = await User.findById(decoded.id).select("_id name email role");
    if (!user) {
      return res.status(401).json({ error: "Token no válido" });
    }

    req.user = user;

    if (user.role !== EnumRoles.ADMIN) {
      return res.status(403).json({ error: "Permisos insuficientes" });
    }

    // 6) OK
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(401).json({ error: "Token no válido" });
  }
};
