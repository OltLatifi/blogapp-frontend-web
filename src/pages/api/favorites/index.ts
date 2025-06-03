import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { favoriteService } from "@/api/services/Favorite";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session.user.id;

    switch (req.method) {
        case "GET":
            try {
                if (req.query.count && req.query.blogId) {
                    const count = await favoriteService.getFavoriteCount(req.query.blogId as string);
                    return res.status(200).json(count);
                }
                const favorites = await favoriteService.getUserFavorites(userId);
                return res.status(200).json(favorites);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error fetching favorites" });
            }

        case "POST":
            try {
                const { blogId } = req.body;
                if (!blogId) {
                    return res.status(400).json({ message: "Blog ID is required" });
                }
                const favorite = await favoriteService.addFavorite(userId, blogId);
                return res.status(201).json(favorite);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error adding favorite" });
            }

        case "DELETE":
            try {
                const { blogId } = req.body;
                if (!blogId) {
                    return res.status(400).json({ message: "Blog ID is required" });
                }
                await favoriteService.removeFavorite(userId, blogId);
                return res.status(200).json({ message: "Favorite removed" });
            } catch (error) {
                return res.status(500).json({ message: "Error removing favorite" });
            }

        default:
            res.setHeader("Allow", ["GET", "POST", "DELETE"]);
            return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
} 