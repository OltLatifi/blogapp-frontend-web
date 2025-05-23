import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CldUploadWidget } from "next-cloudinary";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { blogService } from "@/services/blogService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

    const createBlogMutation = useMutation({
        mutationFn: async (data: BlogFormData) => {
            const tags = data.tags
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            return blogService.create({
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl || undefined,
                tags
            });
        },
        onSuccess: () => {
            toast.success("Blog created successfully");
            router.push("/");
        },
        onError: (error) => {
            setError("An error occurred while creating the blog");
            console.error("Error creating blog:", error);
        }
    });

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        router.replace("/auth/login");
        return null;
    }

    const handleInputChange = (field: keyof BlogFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        createBlogMutation.mutate(formData);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-semibold">Create New Blog</h1>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={handleInputChange("title")}
                                placeholder="Enter blog title"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={handleInputChange("content")}
                                placeholder="Write your blog content"
                                className="min-h-[200px]"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={handleInputChange("tags")}
                                placeholder="e.g. technology, programming, web"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Cover Image</Label>
                            <CldUploadWidget
                                uploadPreset="blog_images"
                                options={{
                                    sources: ["local", "url"],
                                    maxFiles: 1,
                                    resourceType: "image",
                                    showAdvancedOptions: false,
                                    styles: {
                                        palette: {
                                            window: "#FFFFFF",
                                            windowBorder: "#90A0B3",
                                            tabIcon: "#0078FF",
                                            menuIcons: "#5A616A",
                                            textDark: "#000000",
                                            textLight: "#FFFFFF",
                                            link: "#0078FF",
                                            action: "#FF620C",
                                            inactiveTabIcon: "#0E2F5A",
                                            error: "#F44235",
                                            inProgress: "#0078FF",
                                            complete: "#20B832",
                                            sourceBg: "#E4EBF1"
                                        }
                                    }
                                }}
                                onSuccess={(result) => {
                                    const info = result.info as { secure_url: string };
                                    if (info?.secure_url) {
                                        setFormData(prev => ({
                                            ...prev,
                                            imageUrl: info.secure_url
                                        }));
                                        toast.success("Image uploaded successfully");
                                    }
                                }}
                                onError={(error) => {
                                    toast.error("Failed to upload image");
                                    console.error("Upload error:", error);
                                }}
                            >
                                {({ open }) => (
                                    <div className="space-y-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => open()}
                                            className="w-full"
                                        >
                                            Upload Image
                                        </Button>
                                        {formData.imageUrl && (
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                                <img
                                                    src={formData.imageUrl}
                                                    alt="Blog cover"
                                                    className="w-full h-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CldUploadWidget>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={createBlogMutation.isPending}
                            >
                                {createBlogMutation.isPending ? "Creating..." : "Create Blog"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 