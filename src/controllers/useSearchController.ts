import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { albumService, collectionService } from "../services/api";
import { Sticker, SearchResult } from "../types";

export function useSearchController() {
    const [missingStickers, setMissingStickers] = useState<Sticker[]>([]);
    const [results, setResults] = useState<SearchResult[] | null>(null);
    const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingAlbum, setLoadingAlbum] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [albumData, collectionData] = await Promise.all([
                albumService.getAll(),
                collectionService.getMyCollection(),
            ]);
            const ownedIds = new Set(collectionData.filter((c) => c.quantity > 0).map((c) => c.id));
            setMissingStickers(albumData.filter((s) => !ownedIds.has(s.id)));
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoadingAlbum(false);
        }
    };

    const search = async (stickerId: string) => {
        setSelectedStickerId(stickerId);
        setLoading(true);
        try {
            const data = await collectionService.search(stickerId);
            setResults(data);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        missingStickers,
        results,
        selectedStickerId,
        setSelectedStickerId,
        loading,
        loadingAlbum,
        search,
    };
}
