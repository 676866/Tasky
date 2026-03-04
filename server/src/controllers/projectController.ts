import { Request, Response } from "express";
import { PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a new project
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, deadline, organizationId } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!name || !organizationId)
      return res
        .status(400)
        .json({ message: "Project name and organizationId are required" });

    const project = await prisma.project.create({
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : undefined,
        organizationId,
        createdById: userId,
      },
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ message: "Failed to create project", error });
  }
};

/**
 * Get all projects (Admin/Manager) or only assigned projects (Member)
 */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    let projects;
    if (user.role === "ADMIN" || user.role === "MANAGER") {
      // Ensure user has an organization
      if (!user.organizationId) {
        return res
          .status(400)
          .json({ message: "User has no organization assigned" });
      }

      // Fetch all projects in the organization
      projects = await prisma.project.findMany({
        where: { organizationId: user.organizationId },
        include: {
          createdBy: true,
          tasks: true,
          assignments: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Fetch only assigned projects
      projects = await prisma.project.findMany({
        where: {
          assignments: { some: { userId } },
        },
        include: {
          createdBy: true,
          tasks: true,
          assignments: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Get Projects Error:", error);
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};

/**
 * Get single project details
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        organization: true,
        createdBy: true,
        tasks: true,
        assignments: {
          include: { user: true },
        },
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    console.error("Get Project By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch project details", error });
  }
};

/**
 * Update a project
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, deadline, status, progress } = req.body;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(status && { status: status as ProjectStatus }),
        ...(typeof progress === "number" && { progress }),
      },
    });

    res
      .status(200)
      .json({ message: "Project updated successfully", updatedProject });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ message: "Failed to update project", error });
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({ where: { id } });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ message: "Failed to delete project", error });
  }
};

/**
 * Assign a user to a project
 */
export const assignUserToProject = async (req: Request, res: Response) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId)
      return res
        .status(400)
        .json({ message: "Project ID and User ID are required" });

    const existingAssignment = await prisma.projectAssignment.findFirst({
      where: { projectId, userId },
    });

    if (existingAssignment)
      return res
        .status(400)
        .json({ message: "User is already assigned to this project" });

    const assignment = await prisma.projectAssignment.create({
      data: { projectId, userId },
    });

    res.status(201).json({ message: "User assigned successfully", assignment });
  } catch (error) {
    console.error("Assign User Error:", error);
    res
      .status(500)
      .json({ message: "Failed to assign user to project", error });
  }
};
