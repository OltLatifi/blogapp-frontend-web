import { NextApiRequest, NextApiResponse } from "next";
import { getBlogs } from "@/api/services/Blog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const blogs = await getBlogs();
        return res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({ error: "Failed to fetch blogs" });
    }
} 