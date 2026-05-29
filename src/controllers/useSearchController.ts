import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { albumService, collectionService } from "../services/api";
import { Sticker, SearchResult } from "../types";

export function useSearchController() {
    const [album, setAlbum] = useState<Sticker[]>([]);
    const [results, setResults] = useState<SearchResult[] | null>(null);
    const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingAlbum, setLoadingAlbum] = useState(true);

    useEffect(() => {
        loadAlbum();
    }, []);

    const loadAlbum = async () => {
        try {
            const data = await albumService.getAll();
            setAlbum(data);
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
        album,
        results,
        selectedStickerId,
        loading,
        loadingAlbum,
        search,
    };
}
