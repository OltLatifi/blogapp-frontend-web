import { getTeamMembers } from "@/api/services/TeamMember";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const teamMembers = await getTeamMembers();
    return res.status(200).json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return res.status(500).json({ error: "Failed to fetch team members" });
  }
}
