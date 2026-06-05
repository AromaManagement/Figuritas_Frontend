import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearchController } from "../controllers/useSearchController";
import { Sticker, SearchResult } from "../types";

export default function SearchScreen({ navigation }: any) {
const insets = useSafeAreaInsets();
const { missingStickers, results, selectedStickerId, setSelectedStickerId, loading, loadingAlbum, search } =
  useSearchController();

const [optionList, setOptionList] = React.useState<Sticker[]>(missingStickers);

React.useEffect(() => {
  setOptionList(missingStickers);
}, [missingStickers]);

const renderStickerOption = ({ item }: { item: Sticker }) => (
    <TouchableOpacity
      style={[styles.optionCard, selectedStickerId === item.id && styles.optionCardSelected]}
      onPress={() => search(item.id)}
    >
      <Text style={styles.optionCountry}>{item.country.code}</Text>
      <Text style={styles.optionName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderResult = ({ item }: { item: SearchResult }) => (
    <View style={styles.resultCard}>


        <View style={styles.resultHeader}>
        <Text style={styles.resultUser}>{item.user.username}</Text>
        {item.user.city && <Text style={styles.resultCity}>{item.user.city}</Text>}
        <TouchableOpacity style={styles.tradeButton} onPress={() => navigation.navigate("NewTrade", { user: item.user, stickerId: selectedStickerId, userNeeds: item.possibleOffers })}>
          <Text style={styles.tradeButtonText}>Start Trade</Text>
        </TouchableOpacity>
      </View>

      
      
      {item.possibleOffers.length > 0 ? (
        <View style={styles.matchSection}>
        <Text style={styles.matchTitle}>You can offer:</Text>
        {item.possibleOffers.map((offer) => (
          <Text key={offer.id} style={styles.matchItem}>
            • {offer.name} ({offer.country.code})
          </Text>
        ))}
        </View>
      ) : (
        <Text style={styles.noMatch}>They don't need anything you have available</Text>
      )}
        
    </View>
  );

  const handleSearch = (q: string) => {
    q = q.trim().toLowerCase();
    const found = missingStickers.filter((sticker) =>
      sticker.name.toLowerCase().includes(q) ||
      sticker.country.code.toLowerCase().includes(q) ||
      sticker.id.toLowerCase() === q
    );

    setSelectedStickerId(null);
    setOptionList(q === "" ? missingStickers : found.length > 0 ? found : []);
  };

  if (loadingAlbum) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  } 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Find a Sticker</Text>
      </View>

        <TextInput
          style={{ ...styles.searchField }}
          placeholder="Search for a sticker..."
          onChangeText={handleSearch}
        />


      {(optionList.length !== 0) ? (
        <>
          <Text style={styles.instruction}>Select the sticker you are looking for:</Text>
          <FlatList
            data={optionList}
            renderItem={renderStickerOption}
            keyExtractor={(item) => item.id}
            horizontal
            style={styles.optionsList}
            showsHorizontalScrollIndicator={false}
            keyboardDismissMode="on-drag"
          />
          </>
      ) : (
        <Text style={styles.instruction}>No results found</Text>
      )}


      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Searching for trades...</Text>
        </View>
      )}

      {results !== null && !loading && selectedStickerId != null && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {results.length > 0
              ? `${results.length} user(s) have this sticker`
              : "No one has this sticker available"}
          </Text>

          <FlatList
            data={results}
            renderItem={renderResult}
            keyExtractor={(item) => item.user.id.toString()}
            contentContainerStyle={styles.resultsList}
            keyboardDismissMode="on-drag"
          />
        </View>
      )}
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 0,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 12,
  },
  backBtn: { fontSize: 16, color: "#2196F3" },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  instruction: { padding: 15, fontSize: 14, color: "#666" },
  optionsList: { maxHeight: 60, paddingHorizontal: 10 },
  optionCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  optionCardSelected: { borderColor: "#2196F3", backgroundColor: "#e3f2fd" },
  optionCountry: { fontSize: 11, color: "#666", fontWeight: "bold" },
  optionName: { fontSize: 12, marginTop: 2 },
  resultsContainer: { flex: 1, padding: 15 },
  resultsTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  resultsList: { paddingBottom: 20 },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    paddingTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resultUser: { fontSize: 16, fontWeight: "bold", alignItems: "center" },
  resultCity: { fontSize: 13, color: "#666" },
  matchSection: { marginTop: 10, padding: 8, backgroundColor: "#f1f8e9", borderRadius: 6 },
  matchTitle: { fontSize: 13, fontWeight: "bold", color: "#4CAF50", marginBottom: 4 },
  matchItem: { fontSize: 13, color: "#333", marginLeft: 4 },
  noMatch: { fontSize: 13, color: "#999", marginTop: 8, fontStyle: "italic" },
  loadingText: { marginTop: 10, color: "#666" },
  tradeButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  tradeButtonText: { color: "#fff", fontWeight: "600" },
  searchField: {
    marginTop: 10,
    width: "auto",
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "stretch",
    marginHorizontal: 15,
  },
  searchButton: {
    width: 80,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginLeft: 0,
  },
  searchButtonText: { color: "#fff", fontWeight: "600" },
});
