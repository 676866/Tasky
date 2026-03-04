import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignUserToProject,
} from "../controllers/projectController";

const router = Router();

router.post("/", authenticate, createProject);
router.get("/", authenticate, getProjects);
router.get("/:id", authenticate, getProjectById);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);
router.post("/assign", authenticate, assignUserToProject);

export default router;
