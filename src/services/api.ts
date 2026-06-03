import { API_URL } from "./config";
import { authService } from "./auth";
import { Sticker, UserCard, SearchResult, Trade } from "../types";

async function authFetch(path: string, options: RequestInit = {}) {
    const token = await authService.getToken();
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
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

export const tradeService = {
    async getIncomingTrades(): Promise<Trade[]> {
        return authFetch("/trades/incoming");
    },

    async getOutgoingTrades(): Promise<Trade[]> {
        return authFetch("/trades/outgoing");
    },

    async requestTrade(requestedStickerId: string, offeredStickerId: string[], recipientId: number): Promise<void> {
        await authFetch("/trades/request", {
            method: "POST",
            body: JSON.stringify({ requestedStickerId, offeredStickerId, recipientId }),
        });
    },

    async updateTradeStatus(tradeId: string, status: "accepted" | "declined"): Promise<void> {
        await authFetch(`/trades/${tradeId}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        });
    },

    async completeTrade(tradeId: string): Promise<void> {
        await authFetch(`/trades/${tradeId}/complete`, {
            method: "PUT",
        });
    },

    async getTradeById(tradeId: string): Promise<Trade> {
        return authFetch(`/trades/${tradeId}`);
    }
};