import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getUserBlogs } from "@/api/services/Blog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        console.log(session);
        if (!session?.user?.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const blogs = await getUserBlogs(session.user.id);
        return res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        return res.status(500).json({ error: "Failed to fetch blogs" });
    }
} 