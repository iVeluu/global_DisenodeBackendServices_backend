import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { AuthController } from "../controllers/UserController";
import { TaskController } from "../controllers/TaskController";
import { authenticate } from "../middleware/auth";
import { authenticateAdmin } from "../middleware/admin";

const router = Router();

router.get("/", handleInputErrors, authenticate, TaskController.getAllTask);

router.get(
  "/:id",
  handleInputErrors,
  authenticate,
  TaskController.getTaskById
);

router.post(
  "/create",
  handleInputErrors,
  authenticate,
  TaskController.createTask
);

router.put(
  "/update/:id",
  handleInputErrors,
  authenticate,
  TaskController.updateTask
);

router.delete(
  "/delete/:id",
  handleInputErrors,
  authenticate,
  authenticateAdmin,
  TaskController.deleteTask
);

export default router;
