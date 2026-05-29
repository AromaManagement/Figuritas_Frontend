import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { albumService, collectionService } from "../services/api";
import { Sticker } from "../types";

type CardState = { quantity: number; available: number; needed: boolean };

export function useAlbumController() {
    const [album, setAlbum] = useState<Sticker[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [localState, setLocalState] = useState<Map<string, CardState>>(new Map());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [albumData, collectionData] = await Promise.all([
                albumService.getAll(),
                collectionService.getMyCollection(),
            ]);
            setAlbum(albumData);

            const state = new Map<string, CardState>();
            collectionData.forEach((uc) => {
                state.set(uc.id, {
                    quantity: uc.quantity,
                    available: uc.available,
                    needed: uc.needed,
                });
            });
            setLocalState(state);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const getCardState = (stickerId: string): CardState =>
        localState.get(stickerId) ?? { quantity: 0, available: 0, needed: false };

    const toggleOwned = (stickerId: string) => {
        setLocalState((prev) => {
            const next = new Map(prev);
            const current = next.get(stickerId);
            if (current && current.quantity > 0) {
                next.delete(stickerId);
            } else {
                next.set(stickerId, { quantity: 1, available: 0, needed: false });
            }
            return next;
        });
    };

    const incrementQuantity = (stickerId: string) => {
        setLocalState((prev) => {
            const next = new Map(prev);
            const current = next.get(stickerId);
            if (current) {
                const newQty = current.quantity + 1;
                next.set(stickerId, { ...current, quantity: newQty, available: newQty - 1 });
            }
            return next;
        });
    };

    const decrementQuantity = (stickerId: string) => {
        setLocalState((prev) => {
            const next = new Map(prev);
            const current = next.get(stickerId);
            if (current && current.quantity > 1) {
                const newQty = current.quantity - 1;
                next.set(stickerId, {
                    ...current,
                    quantity: newQty,
                    available: Math.max(0, newQty - 1),
                });
            } else if (current && current.quantity === 1) {
                next.delete(stickerId);
            }
            return next;
        });
    };

    // Toggles the "needed" flag. A sticker can only be needed when quantity = 0.
    const toggleNeeded = (stickerId: string) => {
        setLocalState((prev) => {
            const next = new Map(prev);
            const current = next.get(stickerId);
            if (!current) {
                next.set(stickerId, { quantity: 0, available: 0, needed: true });
            } else if (current.quantity === 0) {
                // Only toggle needed when the user does not own the sticker
                next.set(stickerId, { ...current, needed: !current.needed });
                if (!current.needed === false) next.delete(stickerId); // clean up if both false
            }
            return next;
        });
    };

    const saveCollection = async () => {
        setSaving(true);
        try {
            const cards = Array.from(localState.entries()).map(([stickerId, state]) => ({
                stickerId,
                quantity: state.quantity,
                available: state.available,
                needed: state.needed,
            }));
            await collectionService.updateCollection(cards);
            Alert.alert("Success", "Collection saved");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    return {
        album,
        loading,
        saving,
        getCardState,
        toggleOwned,
        incrementQuantity,
        decrementQuantity,
        toggleNeeded,
        saveCollection,
    };
}
