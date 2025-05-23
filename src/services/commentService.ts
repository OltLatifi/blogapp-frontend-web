import api from "./api";

export interface Comment {
    _id: string;
    content: string;
    authorName: string;
    authorId: string;
    blogId: string;
    parentId?: string;
    isEdited: boolean;
    createdAt: string;
    updatedAt: string;
    replies?: Comment[];
}

export interface CreateCommentData {
    content: string;
    blogId: string;
    parentId?: string;
}

export interface UpdateCommentData {
    content: string;
}

export const commentService = {
    create: async (data: CreateCommentData) => {
        const response = await api.post("comments/create", data);
        return response.data;
    },

    getByBlogId: async (blogId: string) => {
        const response = await api.get(`comments/blog/${blogId}`);
        return response.data;
    },

    update: async (commentId: string, data: UpdateCommentData) => {
        const response = await api.put(`comments/${commentId}`, data);
        return response.data;
    },

    delete: async (commentId: string) => {
        const response = await api.delete(`comments/${commentId}`);
        return response.data;
    }
}; 