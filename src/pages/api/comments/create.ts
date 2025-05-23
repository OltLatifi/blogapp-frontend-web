import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { createComment } from "@/api/services/Comment";
import { Comment } from "@/api/models/Comment";
import authOptions from "../auth/[...nextauth]";
import { Session } from "next-auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions) as Session;
    if (!session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { content, blogId, parentId } = req.body;
        
        if (!content || !blogId) {
            return res.status(400).json({ error: "Content and blogId are required" });
        }

        const commentData: Comment = {
            content,
            blogId,
            authorId: session.user.email as string,
            authorName: session.user.name || "Anonymous",
            parentId: parentId || undefined,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await createComment(commentData);
        res.status(201).json({ 
            message: "Comment created successfully",
            commentId: result.insertedId 
        });
    } catch (error) {
        res.status(500).json({ error: "Error creating comment" });
    }
} 