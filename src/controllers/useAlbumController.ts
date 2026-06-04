import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { albumService, collectionService } from "../services/api";
import { Sticker } from "../types";

type CardState = { quantity: number };

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
        localState.get(stickerId) ?? { quantity: 0 };

    const incrementQuantity = (stickerId: string) => {
        setLocalState((prev) => {
            const next = new Map(prev);
            const current = next.get(stickerId);
            if (!current) {
                next.set(stickerId, { quantity: 1});
            } else {
                const newQty = current.quantity + 1;
                next.set(stickerId, { ...current, quantity: newQty});
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
                });
            } else if (current && current.quantity === 1) {
                next.delete(stickerId);
            }
            return next;
        });
    };
    
    const saveCollection = async () => {
        setSaving(true);
        try {
            const cards = Array.from(localState.entries()).map(([stickerId, state]) => ({
                stickerId,
                quantity: state.quantity
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
        loadData,
        album,
        loading,
        saving,
        getCardState,
        incrementQuantity,
        decrementQuantity,
        saveCollection,
    };
}
