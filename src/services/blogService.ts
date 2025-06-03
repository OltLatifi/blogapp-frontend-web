import api from "./api";

export interface Blog {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    authorEmail: string;
    createdAt: string;
    tags?: string[];
    imageUrl?: string;
}

export interface CreateBlogData {
    title: string;
    content: string;
    tags?: string[];
    imageUrl?: string;
}

export const blogService = {
    getAll: async (): Promise<Blog[]> => {
        const { data } = await api.get<Blog[]>("/blogs");
        return data;
    },

    getUserBlogs: async (): Promise<Blog[]> => {
        const { data } = await api.get<Blog[]>("/blogs/my-blogs");
        return data;
    },

    getById: async (id: string): Promise<Blog> => {
        const { data } = await api.get<Blog>(`/blogs/${id}`);
        return data;
    },

    create: async (blogData: CreateBlogData): Promise<Blog> => {
        const { data } = await api.post<Blog>("/blogs/create", blogData);
        return data;
    },

    update: async (id: string, blogData: CreateBlogData): Promise<Blog> => {
        const { data } = await api.put<Blog>(`/blogs/${id}`, blogData);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/blogs/${id}`);
    },
}; 