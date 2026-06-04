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
import { useFocusEffect } from "@react-navigation/native";

export default function AlbumScreen({ navigation }: any) {
  const { logout } = useAuth();
  const {
    loadData,
    album,
    loading,
    saving,
    getCardState,
    incrementQuantity,
    decrementQuantity,
    saveCollection,
  } = useAlbumController();

  const loadDataRef = React.useRef(loadData);
  React.useEffect(() => {
    loadDataRef.current = loadData;
  }, [loadData]);

  useFocusEffect(
    React.useCallback(() => {
      loadDataRef.current && loadDataRef.current();
    }, [])
  );

  const [changed, setChanged] = React.useState(false);
  const handleIncrement = (id: string) => {
    incrementQuantity(id);
    setChanged(true);
  };

  const handleDecrement = (id: string) => {
    decrementQuantity(id);
    setChanged(true);
  };

  const handleSave = async () => {
    await saveCollection();
    setChanged(false);
  };

  const renderSticker = ({ item }: { item: Sticker }) => {
    const state = getCardState(item.id);
    const owned = state.quantity > 0;
    const needed = state.quantity === 0;
    
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
          
            <View style={styles.quantityRow}>
              <TouchableOpacity onPress={() => handleDecrement(item.id)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{state.quantity}</Text>
              <TouchableOpacity onPress={() => handleIncrement(item.id)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    );
  };

  const countries = React.useMemo(() => {
    const map = new Map<string, { code: string; name: string }>();
    album.forEach((s) => {
      if (!map.has(s.country.code)) {
        map.set(s.country.code, { code: s.country.code, name: s.country.name });
      }
    });
    return [{ code: "ALL", name: "All" }, ...Array.from(map.values())];
  }, [album]);

  const [selectedCountry, setSelectedCountry] = React.useState<string>("ALL");

  const filteredAlbum = React.useMemo(() => {
    if (selectedCountry === "ALL") return album;
    return album.filter((s) => s.country.code === selectedCountry);
  }, [album, selectedCountry]);


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
            disabled={changed}
            onPress={() => navigation.navigate("Trade")}
            style={[styles.searchBtn, changed && { opacity: 0.5 }]}
          >
            <Text style={styles.searchBtnText}>Trade</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "flex-start"}}>

      <View>

      <FlatList 
        data={countries}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(c) => c.code}
        contentContainerStyle={styles.chipsContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedCountry === item.code && styles.chipActive]}
            onPress={() => setSelectedCountry(item.code)}
          >
            <Text style={[styles.chipText, selectedCountry === item.code && styles.chipTextActive]}>
              {item.code === "ALL" ? "All" : item.code}
            </Text>
          </TouchableOpacity>
        )}
        />
      </View>

      {/* grid of stickers (filtered by selected country) */}
      <FlatList
        data={filteredAlbum}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSticker}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
      </View>

      {
        changed && (
          <TouchableOpacity style={[styles.saveBtn]} onPress={handleSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Save Collection</Text>
        )}
      </TouchableOpacity>
        )
      }
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
  list: { padding: 8 , flex: 1, justifyContent: "flex-start", backgroundColor: "#f5f5f5" },
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
  cardNeeded: {},
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
  saveBtn: {
    backgroundColor: "#4CAF50",
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  chipsContainer: { paddingHorizontal: 8, paddingVertical: 12, height: 50 },
  chip: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: "#2196F3" },
  chipText: { color: "#333", fontSize: 12, fontWeight: "bold" },
  chipTextActive: { color: "#fff" },
});
