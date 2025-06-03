import api from "./api";

interface AddFavoriteData { 
    userId: string;
    blogId: string;
}

export const favoriteService = {
    addFavorite: async (data: AddFavoriteData) => {
        const response = await api.post("/favorites", { blogId: data.blogId });
        return response.data;
    },

    getFavorites: async () => {
        const response = await api.get("/favorites");
        return response.data;
    },

    removeFavorite: async (blogId: string) => {
        const response = await api.delete("/favorites", { data: { blogId } });
        return response.data;
    },

    getFavoriteCount: async (blogId: string) => {
        const response = await api.get(`/favorites?count=true&blogId=${blogId}`);
        return response.data;
    }
};  