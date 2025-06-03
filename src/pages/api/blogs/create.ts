import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { createBlog } from "@/api/services/Blog";
import { Blog } from "@/api/models/Blog";
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
        const { title, content, tags, imageUrl } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const blogData: Blog = {
            title,
            content,
            authorId: session.user.email as string,
            authorName: session.user.name || "Anonymous",
            tags: tags || [],
            imageUrl: imageUrl || "",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await createBlog(blogData);
        res.status(201).json({ 
            message: "Blog created successfully",
            blogId: result.insertedId 
        });
    } catch {
        res.status(500).json({ error: "Error creating blog" });
    }
} 