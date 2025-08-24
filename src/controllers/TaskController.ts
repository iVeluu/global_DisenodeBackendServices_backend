import { Request, Response } from "express";
import mongoose from "mongoose";
import Task, { ITask } from "../models/Task"; // ajusta la ruta según tu proyecto

const isValidObjectId = (id: string) => mongoose.isValidObjectId(id);

export class TaskController {
  static getAllTask = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({}).sort({ createdAt: -1 });
      return res.status(200).json(tasks);
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Server error",
        error: (err as Error).message,
      });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ ok: false, message: "Task not found" });
      }

      return res.json(task);
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Server error",
        error: (err as Error).message,
      });
    }
  };

  static createTask = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const task = await Task.create({ name, description });
      return res.status(201).json({ ok: true, data: task });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Server error",
        error: (err as Error).message,
      });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ ok: false, message: "Invalid task id" });
      }

      const { name, description } = req.body as Partial<
        Pick<ITask, "name" | "description">
      >;
      if (!name && !description) {
        return res.status(400).json({
          ok: false,
          message: "Provide at least one field to update (name or description)",
        });
      }

      const updated = await Task.findByIdAndUpdate(
        id,
        {
          $set: { ...(name && { name }), ...(description && { description }) },
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ ok: false, message: "Task not found" });
      }

      return res.json({ ok: true, data: updated });
    } catch (err) {
      if ((err as any).name === "ValidationError") {
        return res.status(400).json({
          ok: false,
          message: "Validation error",
          error: (err as Error).message,
        });
      }
      return res.status(500).json({
        ok: false,
        message: "Server error",
        error: (err as Error).message,
      });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await Task.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).send('Tarea no encontrada');
      }

      return res.status(200).send('Tarea eliminada Correctamente');
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Server error",
        error: (err as Error).message,
      });
    }
  };
}
