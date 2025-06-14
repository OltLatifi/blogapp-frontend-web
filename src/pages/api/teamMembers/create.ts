import { createTeamMember } from "@/api/services/TeamMember";
import { NextApiRequest, NextApiResponse } from "next";

export interface CreateTeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, role, bio, imageUrl } = req.body;

    if (!name || !role || !bio || !imageUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const teamMemberData: CreateTeamMember = {
      name,
      role,
      bio,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await createTeamMember(teamMemberData);
    res.status(201).json({
      message: "Team member created successfully",
      teamMemberId: result.insertedId,
    });
  } catch {
    res.status(500).json({ error: "Failed to create team member" });
  }
}
