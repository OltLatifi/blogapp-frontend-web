import { Favorite } from "@/api/models/favorite";
import clientPromise from "@/lib/mongodb";

class FavoriteService {
    async addFavorite(userId: string, blogId: string): Promise<Favorite> {
        const client = await clientPromise();
        const db = client.db("myapp");
        const createdAt = new Date();
        await db.collection("favorites").insertOne({
            userId,
            blogId,
            createdAt
        });
        return {
            userId,
            blogId,
            createdAt
        };
    }

    async removeFavorite(userId: string, blogId: string): Promise<void> {
        const client = await clientPromise();
        const db = client.db("myapp");
        await db.collection("favorites").deleteOne({ userId, blogId });
    }

    async getUserFavorites(userId: string): Promise<Favorite[]> {
        const client = await clientPromise();
        const db = client.db("myapp");
        const favorites = await db.collection("favorites").find({ userId }).sort({ createdAt: -1 }).toArray();
        return favorites.map(favorite => ({
            userId: favorite.userId,
            blogId: favorite.blogId.toString(),
            createdAt: favorite.createdAt?.toISOString() ?? new Date().toISOString()
        }));
    }

    async isFavorite(userId: string, blogId: string): Promise<boolean> {
        const client = await clientPromise();
        const db = client.db("myapp");
        const favorite = await db.collection("favorites").findOne({ userId, blogId });
        return !!favorite;
    }

    async getFavoriteCount(blogId: string): Promise<number> {
        const client = await clientPromise();
        const db = client.db("myapp");
        return db.collection("favorites").countDocuments({ blogId });
    }
}

export const favoriteService = new FavoriteService(); 