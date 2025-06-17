import { TeamMember } from "@/api/models/TeamMember";
import { createTeamMember } from "@/api/services/TeamMember";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export type CreateTeamMember = Omit<TeamMember, "createdAt" | "updatedAt">;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const teamMemberData: CreateTeamMember = req.body;

    if (!teamMemberData.name || !teamMemberData.role || !teamMemberData.bio) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await createTeamMember(teamMemberData);
    res.status(201).json({
      message: "Team member created successfully",
      teamMemberId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    return res.status(500).json({ error: "Failed to create team member" });
  }
}
