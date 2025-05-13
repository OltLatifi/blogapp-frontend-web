import { createContext, useContext, useState, ReactNode } from "react";
import { Blog } from "@/api/models/Blog";

interface BlogContextType {
    blogs: typeof Blog[];
    setBlogs: React.Dispatch<React.SetStateAction<typeof Blog[]>>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
    // Initialize with an empty array matching the type
    const [blogs, setBlogs] = useState<typeof Blog[]>([]);

    return (
        <BlogContext.Provider value={{ blogs, setBlogs }}>
            {children}
        </BlogContext.Provider>
    );
};

export const useBlogContext = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error("useBlogContext must be used within a BlogProvider");
    }
    return context;
};