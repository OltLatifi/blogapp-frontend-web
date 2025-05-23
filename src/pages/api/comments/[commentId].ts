import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { updateComment, deleteComment } from "@/api/services/Comment";
import authOptions from "../auth/[...nextauth]";
import { Session } from "next-auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions) as Session;
    if (!session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { commentId } = req.query;
    if (!commentId || typeof commentId !== "string") {
        return res.status(400).json({ error: "Valid commentId is required" });
    }

    try {
        switch (req.method) {
            case "PUT": {
                const { content } = req.body;
                if (!content) {
                    return res.status(400).json({ error: "Content is required" });
                }
                await updateComment(commentId, content);
                res.status(200).json({ message: "Comment updated successfully" });
                break;
            }
            case "DELETE": {
                await deleteComment(commentId);
                res.status(200).json({ message: "Comment deleted successfully" });
                break;
            }
            default:
                res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error processing comment" });
    }
} 