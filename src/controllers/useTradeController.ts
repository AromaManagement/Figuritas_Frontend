import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {  tradeService } from "../services/api";
import {  Trade } from "../types";

export function useTradeController() {
    const [incomingTrades, setIncomingTrades] = useState<Trade[]>([]);
    const [outgoingTrades, setOutgoingTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        loadTrades();
    }, []);

    const loadTrades = async () => {
        setLoading(true);
        try {
            var incoming = await tradeService.getIncomingTrades();
            var outgoing = await tradeService.getOutgoingTrades();
            setIncomingTrades(incoming);
            setOutgoingTrades(outgoing);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const requestTrade = async (requestedStickerId: string, offeredStickerIds: string[], recipientId: number) => {
        tradeService.requestTrade(requestedStickerId, offeredStickerIds, recipientId);
    }

    const updateTradeStatus = async (tradeId: string, newStatus: "accepted" | "declined") => {
        tradeService.updateTradeStatus(tradeId, newStatus);
    }

    const completeTrade = async (tradeId: string) => {
        tradeService.completeTrade(tradeId);
    };

    const getTradeById = (tradeId: string): Promise<Trade | undefined> => {
        return tradeService.getTradeById(tradeId);
    }

    return {
        incomingTrades,
        outgoingTrades,
        loading,
        getTradeById,
        requestTrade,
        updateTradeStatus,
        completeTrade
    };
}


