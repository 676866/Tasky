import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, category, dueDate, status } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Missing user ID" });
  }

  if (!title || !category || !dueDate) {
    return res
      .status(400)
      .json({ message: "Title, category, and due date are required" });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        category,
        dueDate: new Date(dueDate),
        completed: false,
        userId,
        status: status || "Pending",
      },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Missing user ID" });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Missing user ID" });
  }

  const { title, description, category, dueDate, completed, status } = req.body;

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
  if (completed !== undefined) updateData.completed = completed;
  if (status !== undefined) updateData.status = status;

  try {
    const task = await prisma.task.updateMany({
      where: { id, userId },
      data: updateData,
    });

    if (task.count === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Missing user ID" });
  }

  try {
    const task = await prisma.task.deleteMany({
      where: { id, userId },
    });

    if (task.count === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
