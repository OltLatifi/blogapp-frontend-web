import type { NextApiRequest, NextApiResponse } from "next";
import { getCommentsByBlogId } from "@/api/services/Comment";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { blogId } = req.query;
        
        if (!blogId || typeof blogId !== "string") {
            return res.status(400).json({ error: "Valid blogId is required" });
        }

        const comments = await getCommentsByBlogId(blogId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: "Error fetching comments" });
    }
} 