import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
