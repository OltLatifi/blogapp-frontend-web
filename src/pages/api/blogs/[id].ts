import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid blog ID" });
    }

    try {
        const client = await clientPromise;
        const db = client.db("myapp");

        switch (req.method) {
            case "GET":
                const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
                
                if (!blog) {
                    return res.status(404).json({ error: "Blog not found" });
                }

                return res.status(200).json(blog);

            case "PUT":
                const { title, content } = req.body;

                if (!title || !content) {
                    return res.status(400).json({ error: "Title and content are required" });
                }

                const updateResult = await db.collection("blogs").findOneAndUpdate(
                    { 
                        _id: new ObjectId(id),
                        authorId: session.user.id
                    },
                    { 
                        $set: { 
                            title,
                            content,
                            updatedAt: new Date()
                        }
                    },
                    { returnDocument: "after" }
                );

                if (!updateResult || !updateResult.value) {
                    return res.status(404).json({ error: "Blog not found or unauthorized" });
                }

                return res.status(200).json(updateResult.value);

            case "DELETE":
                const blogToDelete = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
                
                if (!blogToDelete) {
                    return res.status(404).json({ error: "Blog not found" });
                }

                if (blogToDelete.authorId !== session.user.email) {
                    return res.status(403).json({ error: "Unauthorized to delete this blog" });
                }

                await db.collection("blogs").deleteOne({
                    _id: new ObjectId(id),
                    authorId: session.user.email
                });

                return res.status(200).json({ message: "Blog deleted successfully" });

            default:
                res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
                return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error("Error handling blog request:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
} 