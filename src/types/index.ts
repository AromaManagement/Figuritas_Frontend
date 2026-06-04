export enum StickerType {
    PLAYER = "PLAYER",
    BADGE = "BADGE",
    STADIUM = "STADIUM",
    SPECIAL = "SPECIAL",
}

export interface Country {
    code: string;
    name: string;
    totalStickers: number;
}

export interface Sticker {
    id: string;
    country: Country;
    countryNumber: number;
    code: string;
    name: string;
    type?: StickerType;
    img: string;
}

// A sticker in the user's collection (owned or wanted)
export interface UserCard extends Sticker {
    quantity: number;   // copies owned (0 if only wanted)
}

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface SearchResult {
    user: {
        id: number;
        username: string;
        city: string | null;
        lat: number | null;
        lng: number | null;
    };
    sticker: Sticker;
    possibleOffers: (Sticker)[];
}

export interface TradePartner {
    id: number;
    username: string;
    phonenumber?: string;
}

export interface Trade {
  id: string;
  requestedSticker: Sticker;
  offeredSticker: Sticker[];
  partner: TradePartner;
  status: "declined" | "ongoing" | "accepted" | "completed";
  direction?: "incoming" | "outgoing";
}