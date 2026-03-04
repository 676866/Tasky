import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  moveToTrash,
} from "../controllers/taskController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();    

router.use(authenticate);

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.put("/tasks/:id", updateTask);
router.put("/tasks/:id/trash", moveToTrash);

export default router;
