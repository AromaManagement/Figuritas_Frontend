import { API_URL } from "./config";
import { authService } from "./auth";
import { Sticker, UserCard, SearchResult } from "../types";

async function authFetch(path: string, options: RequestInit = {}) {
    const token = await authService.getToken();
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Request failed");
    }

    return response.json();
}

export const albumService = {
    async getAll(): Promise<Sticker[]> {
        const token = await authService.getToken();
        const response = await fetch(`${API_URL}/album`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },
};

export const collectionService = {
    async getMyCollection(): Promise<UserCard[]> {
        return authFetch("/collection");
    },

    async updateCollection(
        cards: { stickerId: string; quantity: number; available: number; needed: boolean }[]
    ): Promise<void> {
        await authFetch("/collection", {
            method: "PUT",
            body: JSON.stringify({ cards }),
        });
    },

    async search(stickerId: string): Promise<SearchResult[]> {
        return authFetch(`/collection/search?stickerId=${stickerId}`);
    },
};
