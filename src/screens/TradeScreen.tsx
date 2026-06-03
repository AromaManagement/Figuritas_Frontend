import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Trade } from "../types";
import { useTradeController } from "../controllers/useTradeController";

const RECEIVED = "received" as const;
const SENT = "sent" as const;
type Tab = typeof RECEIVED | typeof SENT;

export default function TradeScreen({ navigation , route}: any) {
  const { outgoingTrades, incomingTrades, loading } = useTradeController();
  const { initialActiveTab } = route?.params ?? {};
  const [activeTab, setActiveTab] = useState<Tab>(initialActiveTab || RECEIVED);

  const goToSearch = () => {
    navigation.navigate("Search");
  };

  const onTradePress = (trade: Trade) => {
    navigation.navigate("TradeData", { tradeId: trade.id });
  }

  const renderTrade = ({ item }: { item: Trade }) => (
    <TouchableOpacity style={styles.tradeItem} onPress={() => onTradePress(item)}>
      <View style={styles.tradeInfo}>
        <Text style={styles.cardName}>{item.requestedSticker.name}</Text>
        <Text style={styles.partner}> ⇄ {item.offeredSticker.map(sticker => sticker.name).join(", ")}</Text>
        <Text style={styles.partner}>User: {item.partner.username}</Text>
      </View>
      <View style={[styles.statusBadge, statusStyle(item.status)]}>
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

   

  const displayedTrades = activeTab === RECEIVED ? incomingTrades : outgoingTrades;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sticker Trades</Text>
    </View>

    <View style={styles.listContainer}>
      <View >
        <Text style={styles.searchTitle}>Start a trade</Text>
        <View style={styles.searchSection}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.searchLabel, { marginTop: 4, marginRight: 8 }]}>
              Search a sticker you need and find someone to trade with
            </Text>
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={goToSearch}>
              <Text style={styles.searchButtonText}>Go to Search</Text>
            </TouchableOpacity>
          </View>
          </View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>
          {"Your Trades"}
        </Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === RECEIVED && styles.tabActive]}
          onPress={() => setActiveTab(RECEIVED)}
        >
          <Text style={[styles.tabText, activeTab === RECEIVED && styles.tabTextActive]}>
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === SENT && styles.tabActive]}
          onPress={() => setActiveTab(SENT)}
        >
          <Text style={[styles.tabText, activeTab === SENT && styles.tabTextActive]}>Sent</Text>
        </TouchableOpacity>
      </View>

     

      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : (
        <FlatList
          data={displayedTrades}
          keyExtractor={(i) => i.id}
          renderItem={renderTrade}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {activeTab === RECEIVED ? "No received offers" : "No sent offers"}
            </Text>
          }
        />
      )}
    </View>
    </View>
  );
}

const statusStyle = (status: Trade["status"]) => {
  switch (status) {
    case "accepted":
    case "completed":
      return { backgroundColor: "#d4f5d4" };
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
    gap: 12,
  },
  listContainer: { flex: 1, paddingHorizontal: 15 },
  backBtn: { fontSize: 16, color: "#2196F3" },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  searchTitle: { fontSize: 18, fontWeight: "600", marginTop: 10 },
  searchLabel: { fontSize: 16 },
  searchButton: {
    backgroundColor: "#2b8cf7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  searchButtonText: { color: "#fff", fontWeight: "600" },

  tabRow: {
    flexDirection: "row",
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  tabActive: { backgroundColor: "#2b8cf7" },
  tabText: { color: "#333", fontWeight: "600" },
  tabTextActive: { color: "#fff" },

  listHeader: { marginTop: 16, marginBottom: 8 },
  listHeaderText: { fontSize: 18, fontWeight: "600" },
  tradeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
  },
  tradeInfo: {},
  cardName: { fontSize: 16, fontWeight: "600" },
  partner: { fontSize: 13, color: "#666", marginTop: 4 },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  empty: { textAlign: "center", marginTop: 24, color: "#777" },
});