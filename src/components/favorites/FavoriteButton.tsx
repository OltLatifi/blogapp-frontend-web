import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "@/services/favoriteService";
import { Favorite } from "@/api/models/favorite";

interface FavoriteButtonProps {
    blogId: string;
    initialIsFavorite?: boolean;
}

export function FavoriteButton({ blogId, initialIsFavorite = false }: FavoriteButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

    const { data: favorites } = useQuery({
        queryKey: ["favorites"] as const,
        queryFn: () => favoriteService.getFavorites(),
        enabled: !!session,
    });

    useEffect(() => {
        if (favorites) {
            setIsFavorite(favorites.some((fav: Favorite) => fav.blogId === blogId));
        }
    }, [favorites, blogId]);

    const toggleFavoriteMutation = useMutation({
        mutationFn: async () => {
            if (isFavorite) {
                await favoriteService.removeFavorite(blogId);
            } else {
                await favoriteService.addFavorite({ userId: session?.user?.id ?? "", blogId });
            }
        },
        onSuccess: () => {
            setIsFavorite(!isFavorite);
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
            toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
        },
        onError: () => {
            
            toast.error("Failed to update favorite");
        }
    });

    function handleClick() {
        if (!session) {
            router.push("/auth/login");
            return;
        }
        toggleFavoriteMutation.mutate();
    }

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                isFavorite 
                    ? "bg-red-100 text-red-600 hover:bg-red-200" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            disabled={toggleFavoriteMutation.isPending}
        >
            <Heart 
                className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} 
            />
            <span className="text-sm">
                {isFavorite ? "Favorited" : "Favorite"}
            </span>
        </button>
    );
} 