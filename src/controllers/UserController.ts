import { Request, Response } from "express";

import User, { EnumRoles } from "../models/User";
import { checkPassword, hashPassword } from "../helpers/auth";
import { generateJWT } from "../helpers/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("El Usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }

      const user = new User(req.body);

      user.password = await hashPassword(password);

      await user.save();
      res.send("Usuario creado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        email: email.toLowerCase().trim(),
      }).select("+password");
      if (!user) {
        res.status(401).send("Credenciales inválidas");
        return;
      }

      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        res.status(401).send("Credenciales inválidas");
        return;
      }

      const token = generateJWT({ id: user.id, name: user.name });
      res.status(200).send(token);
    } catch (err) {
      res.status(500).send("Server error");
    }
  };

  static user = async (req: Request, res: Response) => {
    return res.json(req.user);
  };

  static becomeAdmin = async (req: Request, res: Response) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ ok: false, message: "No autorizado" });
      }

      if (req.user.role === EnumRoles.ADMIN) {
        return res.status(200).send("Ya eres ADMIN");
      }

      const updated = await User.findByIdAndUpdate(
        req.user._id,
        { role: EnumRoles.ADMIN },
        { new: true } 
      ).select("_id name email role");

      if (!updated) {
        return res
          .status(404)
          .json({ ok: false, message: "Usuario no encontrado" });
      }

      return res.status(200).send('Felicidades eres ADMIN');
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Server error",
        error: (err as Error).message,
      });
    }
  };
}
