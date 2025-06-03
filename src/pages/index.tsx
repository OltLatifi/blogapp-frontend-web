import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Hero from "@/components/home/hero";
import { blogService } from "@/services/blogService";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";

export default function HomePage() {
    const { data: blogs, isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: () => blogService.getAll(),
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />
            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.08
                        }
                    }
                }}
            >
                <AnimatePresence>
                    {blogs?.map((blog, idx) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.35, delay: idx * 0.05, type: "spring", stiffness: 120 }}
                            layout
                        >
                            <Card className="hover:shadow-lg transition-shadow overflow-hidden pt-0">
                                {blog.imageUrl && (
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={blog.imageUrl}
                                            alt={blog.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
                                    <p className="text-gray-600 line-clamp-3">{blog.content}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <Link
                                            href={`/blogs/${blog._id}`}
                                            className="hover:underline"
                                        >
                                            Read more
                                        </Link>
                                        <FavoriteButton blogId={blog._id} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}