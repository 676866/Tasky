import { Request, Response } from "express";
import prisma from "../prisma/client";

// Create an organization (managers/admins only)
export const createOrganization = async (req: any, res: Response) => {
  try {
    const { name, description } = req.body;

    const org = await prisma.organization.create({
      data: {
        name,
        description,
        users: {
          connect: { id: req.user.id },
        },
      },
    });

    // Promote the user to "manager"
    await prisma.user.update({
      where: { id: req.user.id },
      data: { organizationId: org.id, role: "MANAGER" },
    });

    res.status(201).json({ message: "Organization created", org });
  } catch (error) {
    res.status(500).json({ error: "Failed to create organization" });
  }
};

// Join an existing organization
export const joinOrganization = async (req: any, res: Response) => {
  try {
    const { organizationId } = req.body;

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!org) return res.status(404).json({ error: "Organization not found" });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { organizationId },
    });

    res.json({ message: "Joined organization successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to join organization" });
  }
};

// Get organization details + members
export const getOrganizationDetails = async (req: any, res: Response) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.params.id },
      include: {
        users: { select: { id: true, name: true, email: true, role: true } },
        projects: true,
      },
    });

    if (!org) return res.status(404).json({ error: "Organization not found" });
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch organization details" });
  }
};
