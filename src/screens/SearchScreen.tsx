import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSearchController } from "../controllers/useSearchController";
import { Sticker, SearchResult } from "../types";

export default function SearchScreen({ navigation }: any) {
  const { album, results, selectedStickerId, loading, loadingAlbum, search } =
    useSearchController();

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
      </View>
      <Text style={styles.resultAvailable}>
        {item.available} available
      </Text>

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

  if (loadingAlbum) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find a Sticker</Text>
      </View>

      <Text style={styles.instruction}>Select the sticker you are looking for:</Text>

      <FlatList
        data={album}
        renderItem={renderStickerOption}
        keyExtractor={(item) => item.id}
        horizontal
        style={styles.optionsList}
        showsHorizontalScrollIndicator={false}
      />

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Searching for trades...</Text>
        </View>
      )}

      {results !== null && !loading && (
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
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  backBtn: { fontSize: 16, color: "#2196F3" },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  instruction: { padding: 15, fontSize: 14, color: "#666" },
  optionsList: { maxHeight: 80, paddingHorizontal: 10 },
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    minWidth: 100,
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resultUser: { fontSize: 16, fontWeight: "bold" },
  resultCity: { fontSize: 13, color: "#666" },
  resultAvailable: { fontSize: 13, color: "#4CAF50", marginTop: 4 },
  matchSection: { marginTop: 10, padding: 8, backgroundColor: "#f1f8e9", borderRadius: 6 },
  matchTitle: { fontSize: 13, fontWeight: "bold", color: "#4CAF50", marginBottom: 4 },
  matchItem: { fontSize: 13, color: "#333", marginLeft: 4 },
  noMatch: { fontSize: 13, color: "#999", marginTop: 8, fontStyle: "italic" },
  loadingText: { marginTop: 10, color: "#666" },
});
