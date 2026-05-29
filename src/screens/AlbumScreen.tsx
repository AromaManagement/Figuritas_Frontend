import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useAlbumController } from "../controllers/useAlbumController";
import { Sticker } from "../types";

export default function AlbumScreen({ navigation }: any) {
  const { logout } = useAuth();
  const {
    album,
    loading,
    saving,
    getCardState,
    toggleOwned,
    incrementQuantity,
    decrementQuantity,
    toggleNeeded,
    saveCollection,
  } = useAlbumController();

  const renderSticker = ({ item }: { item: Sticker }) => {
    const state = getCardState(item.id);
    const owned = state.quantity > 0;
    const needed = state.needed;

    return (
      <View style={[styles.card, owned && styles.cardOwned, needed && !owned && styles.cardNeeded]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardCountry}>{item.country.code}</Text>
          <Text style={styles.cardNumber}>#{item.countryNumber}</Text>
        </View>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardType}>{item.type}</Text>

        <View style={styles.cardActions}>
          {owned ? (
            <View style={styles.quantityRow}>
              <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{state.quantity}</Text>
              <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => toggleOwned(item.id)} style={styles.addBtn}>
              <Text style={styles.addBtnText}>I have it</Text>
            </TouchableOpacity>
          )}

          {!owned && (
            <TouchableOpacity
              onPress={() => toggleNeeded(item.id)}
              style={[styles.needBtn, needed && styles.needBtnActive]}
            >
              <Text style={[styles.needBtnText, needed && styles.needBtnTextActive]}>
                {needed ? "✓ Need it" : "Need it"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {owned && state.available > 0 && (
          <Text style={styles.availableText}>Available: {state.available}</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Album</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Search")}
            style={styles.searchBtn}
          >
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={album}
        renderItem={renderSticker}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveCollection} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Save Collection</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  headerButtons: { flexDirection: "row", gap: 8 },
  searchBtn: { backgroundColor: "#2196F3", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  searchBtnText: { color: "#fff", fontWeight: "bold" },
  logoutBtn: { backgroundColor: "#f44336", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  logoutBtnText: { color: "#fff", fontWeight: "bold" },
  list: { padding: 8 },
  card: {
    flex: 1,
    margin: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 2,
    borderColor: "#eee",
  },
  cardOwned: { borderColor: "#4CAF50", backgroundColor: "#f1f8e9" },
  cardNeeded: { borderColor: "#FF9800", backgroundColor: "#fff3e0" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardCountry: { fontSize: 12, fontWeight: "bold", color: "#666" },
  cardNumber: { fontSize: 12, color: "#999" },
  cardName: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  cardType: { fontSize: 11, color: "#888", marginTop: 2 },
  cardActions: { marginTop: 8, gap: 4 },
  quantityRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  qtyBtn: { backgroundColor: "#ddd", borderRadius: 4, width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  qtyBtnText: { fontSize: 16, fontWeight: "bold" },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: "bold" },
  addBtn: { backgroundColor: "#e3f2fd", borderRadius: 4, padding: 6, alignItems: "center" },
  addBtnText: { color: "#2196F3", fontSize: 12, fontWeight: "bold" },
  needBtn: { borderRadius: 4, padding: 6, alignItems: "center", borderWidth: 1, borderColor: "#FF9800" },
  needBtnActive: { backgroundColor: "#FF9800" },
  needBtnText: { color: "#FF9800", fontSize: 12, fontWeight: "bold" },
  needBtnTextActive: { color: "#fff" },
  availableText: { fontSize: 11, color: "#4CAF50", textAlign: "center", marginTop: 4 },
  saveBtn: {
    backgroundColor: "#4CAF50",
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
