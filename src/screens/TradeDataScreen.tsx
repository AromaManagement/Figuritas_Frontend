import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Sticker, Trade } from "../types";
import { useTradeController } from "../controllers/useTradeController";

export default function TradeDataScreen({ navigation, route }: any) {
  const [loading, setLoading] = useState(false);
  const tradeId: string | undefined = route.params?.tradeId;
  const { updateTradeStatus, completeTrade, getTradeById } = useTradeController();
  const [trade, setTrade] = useState<Trade | undefined>(undefined);

  const fetchTradeData = () => {
    if (!tradeId) {
      Alert.alert("Error", "No trade ID provided");
      navigation.goBack();
      return;
    }
    
    setLoading(true);
    
    getTradeById(tradeId)
      .then((data) => {
        if (!data) {
          Alert.alert("Error", "Trade not found");
          navigation.goBack();
          return;
        }
        setTrade(data);
      })
      .catch((error) => {
        Alert.alert("Error loading trade", error.message);
        navigation.goBack();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTradeData();
  }, [tradeId]);

  const formatStickerString = (sticker: Sticker) => {
    return `${sticker.name} (${sticker.country.code} #${sticker.countryNumber})`;
  }


  const handleCompleteTrade = () => {
    if (!trade) return;

    setLoading(true);
    completeTrade(trade.id)
    .then(() => {
      Alert.alert("Success", "Trade completed successfully!");
      fetchTradeData(); // Refresh trade data to get updated status
    })
    .catch((error) => {
      alert("Error completing trade: " + error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const acceptTrade = () => {
    if (!trade) return;

    setLoading(true);
    updateTradeStatus(trade.id, "accepted")
    .then(() => {
      Alert.alert("Success", "Trade accepted successfully!");
      fetchTradeData(); // Refresh trade data to get updated status and contact info
    })
    .catch((error) => {
      alert("Error accepting trade: " + error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const declineTrade = () => {
    if (!trade) return;
    setLoading(true);
    updateTradeStatus(trade.id, "declined")
    .then(() => {
      Alert.alert("Success", "Trade declined successfully!");
      fetchTradeData(); // Refresh trade data to get updated status
    })
    .catch((error) => {
      alert("Error declining trade: " + error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!trade) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.empty}>No trade data</Text>
      </View>
    );
  }

  const cardsToGive = trade?.direction === "outgoing" ? trade.offeredSticker : [trade.requestedSticker];
  const cardsToReceive = trade?.direction === "outgoing" ? [trade.requestedSticker] : trade.offeredSticker;

  const Button = ({ text, style, onPress }: { text: string; style?: any; onPress: () => void }) => (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={styles.actionButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trade detail</Text>
      </View>

      <View style={styles.listContainer}>

        <View style={styles.detailCard}>
          <View style={styles.tradeInfo}>
            <View style={styles.tradeHeader}>
              <View>
                <Text style={styles.tradeTitle}>Trade</Text>
              <Text style={styles.tradeSubtitle}>#{trade.id}</Text>
            </View>

              <View style={[styles.statusBadge, statusStyle(trade.status)]}>
                <Text style={styles.statusText}>{trade.status.toUpperCase()}</Text>
              </View>
            </View>


            <Text style={styles.label}>You Receive </Text>
            {cardsToReceive.map((sticker: Sticker, idx: number) => (
              <Text key={idx} style={styles.cardName}>{formatStickerString(sticker)}</Text>
            ))}

            <Text style={styles.label}>You Offer </Text>
            {cardsToGive.map((sticker: Sticker, idx: number) => (
              <Text key={idx} style={styles.cardName}>{formatStickerString(sticker)}</Text>
            ))}

            

            <Text style={styles.label}>Trading with <Text style={styles.partner}>{trade.partner.username}</Text></Text>
            {trade.partner.phonenumber && (
              <>
                <Text style={styles.label}>Contact info: 
                  <Text style={styles.partner}>{trade.partner.phonenumber}</Text>
                </Text>
              </>
            )}
            
            <View style={styles.tradeFooter}>
              {trade.status === "ongoing" && trade.direction === "incoming" && (
                <>
                  <Button text="Decline" style={styles.negativeButton} onPress={declineTrade} />
                  <Button text="Accept" style={styles.actionButton} onPress={acceptTrade} />
                </>
              )}
              {trade.status === "accepted" && (
                <Button text="Complete" style={styles.actionButton} onPress={handleCompleteTrade} />
              )}
            </View>
          </View>

        </View>
      </View>
    </View>
  );
}

const statusStyle = (status: Trade["status"]) => { 
  switch (status) {
    case "accepted":
      return { backgroundColor: "#d4f5d4" };
    case "completed":
      return { backgroundColor: "#c2c3f0ff" };
    case "ongoing":
      return { backgroundColor: "#fff4c2" };
    case "declined":
      return { backgroundColor: "#ffd6d6" };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listContainer: { flex: 1, paddingHorizontal: 15, paddingTop: 12 },
  backBtn: { fontSize: 16, color: "#2196F3", marginRight: 12 }, 
  headerTitle: { fontSize: 20, fontWeight: "bold", flex: 1 },

  container: { flex: 1, backgroundColor: "#f5f5f5" },

  tradeHeader: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 0 },

  tradeTitle: { fontSize: 22, fontWeight: "700", marginBottom: 0 },
  tradeSubtitle: { fontSize: 14, color: "#000", marginBottom: 0 },

  detailCard: {
    marginTop: 0,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  tradeInfo: { flex: 1, paddingRight: 12, flexShrink: 1, marginTop:0 }, // allow content to shrink on small screens
  cardName: { fontSize: 18, fontWeight: "700" },
  partner: { fontSize: 16, color: "#000000", marginTop: 6 },

  label: { fontSize: 14, color: "#666", marginTop: 12 },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 86,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  statusText: { fontSize: 12, fontWeight: "700" },

  empty: { textAlign: "center", marginTop: 24, color: "#777" },
  center: { justifyContent: "center", alignItems: "center" },

  tradeFooter: { width: "100%", flexDirection: "row", justifyContent: "flex-end", marginTop: 20 },
  actionButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 12,
  },
  actionButtonText: { color: "#fff", fontWeight: "600" },
  negativeButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  negativeButtonText: { color: "#fff", fontWeight: "600" },
  copyButton: {
    marginTop: 6,
    backgroundColor: "#2196F3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  copyButtonText: { color: "#fff", fontWeight: "600" },
  
});