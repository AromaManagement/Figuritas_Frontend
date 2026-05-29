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
    name: string;
    type: StickerType;
    img: string;
}

// A sticker in the user's collection (owned or wanted)
export interface UserCard extends Sticker {
    quantity: number;   // copies owned (0 if only wanted)
    available: number;  // copies not committed to active trades
    needed: boolean;    // true only when quantity = 0 (user wants it for the album)
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
    available: number;
    possibleOffers: (Sticker & { available: number })[];
}
