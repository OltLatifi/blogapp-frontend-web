import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { favoriteService } from "@/services/favoriteService";
import { blogService } from "@/services/blogService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Favorite } from "@/api/models/favorite";

export default function FavoritesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
        queryKey: ["favorites"],
        queryFn: () => favoriteService.getFavorites(),
        enabled: !!session
    });

    const { data: blogs, isLoading: isLoadingBlogs } = useQuery({
        queryKey: ["favorite-blogs", favorites?.map((f: Favorite) => f.blogId)],
        queryFn: async () => {
            if (!favorites?.length) return [];
            const blogPromises = favorites.map((fav: Favorite) => blogService.getById(fav.blogId));
            return Promise.all(blogPromises);
        },
        enabled: !!favorites?.length
    });

    if (status === "loading" || isLoadingFavorites || isLoadingBlogs) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        router.push("/auth/login");
        return null;
    }

    if (!blogs?.length) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
                <div className="text-center text-gray-600">
                    <p>You haven&apos;t favorited any articles yet.</p>
                    <Link href="/" className="text-blue-500 hover:underline mt-2 inline-block">
                        Browse articles
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <motion.div
                        key={blog._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                            {blog.imageUrl && (
                                <div className="relative w-full h-48">
                                    <Image
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl">{blog.title}</CardTitle>
                                <div className="text-sm text-gray-500">
                                    By {blog.authorName ?? "Anonymous"} • {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 line-clamp-3 mb-4">{blog.content}</p>
                                <div className="flex justify-between items-center">
                                    <Link
                                        href={`/blogs/${blog._id}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Read more
                                    </Link>
                                    <FavoriteButton blogId={blog._id} initialIsFavorite={true} />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
} 