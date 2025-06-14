import getMongoClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid team member ID" });
  }

  try {
    const client = await getMongoClient();
    const db = client.db("myapp");
    switch (req.method) {
      case "GET":
        const teamMember = await db
          .collection("teamMembers")
          .findOne({ _id: new ObjectId(id) });

        if (!teamMember) {
          return res.status(404).json({ error: "Team member not found" });
        }

        return res.status(200).json(teamMember);

      case "DELETE":
        const deleteResult = await db
          .collection("teamMembers")
          .deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: "Team member not found" });
        }

        return res.status(204).end();
      case "PUT":
        const { name, role, bio, imageUrl } = req.body;
        if (!name || !role || !bio) {
          return res
            .status(400)
            .json({ error: "Name, role, and bio are required" });
        }
        const updateResult = await db
          .collection("teamMembers")
          .findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { name, role, bio, imageUrl, updatedAt: new Date() } },
            { returnDocument: "after" }
          );
        if (!updateResult || !updateResult.value) {
          return res
            .status(404)
            .json({ error: "Team member not found or update failed" });
        }
        return res.status(200).json(updateResult.value);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling team member request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
