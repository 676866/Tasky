import express from "express";
import {
  createOrganization,
  joinOrganization,
  getOrganizationDetails,
} from "../controllers/organizationController";
import { authenticate } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

router.post("/", authenticate, checkRole(["manager", "admin"]), createOrganization);
router.post("/join", authenticate, joinOrganization);
router.get("/:id", authenticate, getOrganizationDetails);

export default router;
