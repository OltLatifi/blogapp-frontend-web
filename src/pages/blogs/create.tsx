import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";

interface BlogFormData {
    title: string;
    content: string;
    tags: string;
    imageUrl: string;
}

export default function CreateBlog() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState<BlogFormData>({
        title: "",
        content: "",
        tags: "",
        imageUrl: ""
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { create } = useFetch("/api/blogs/create");

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        router.push("/auth/login");
        return null;
    }

    const handleInputChange = (field: keyof BlogFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const tags = formData.tags
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const response = await create({
                ...formData,
                tags
            });

            if (response?.error) {
                setError(response.error);
            } else {
                router.push("/blogs");
            }
        } catch (err) {
            setError("An error occurred while creating the blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-semibold">Create New Blog</h1>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 mb-4 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={handleInputChange("title")}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Content
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={handleInputChange("content")}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={handleInputChange("tags")}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. technology, programming, web"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Image URL (optional)
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={handleInputChange("imageUrl")}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? "Creating..." : "Create Blog"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 