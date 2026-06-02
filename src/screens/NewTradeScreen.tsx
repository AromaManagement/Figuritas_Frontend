import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { Sticker } from "../types";
import { useAlbumController } from "../controllers/useAlbumController";
import { useTradeController } from "../controllers/useTradeController";


export default function NewTradeScreen({ navigation, route }: any) {
  const { user, stickerId } = route.params;
  const [loading, setLoading] = useState(false);
  const [stickersToOffer, setStickersToOffer] = useState<Sticker[]>([]);
  

  const { album, getCardState } = useAlbumController();
  const { requestTrade } = useTradeController();

  const handelRequestTrade = () => {
    setLoading(true);
    requestTrade(stickerId, stickersToOffer.map(s => s.id), user.id)
    .then(() => {
        Alert.alert("Success", "Trade request sent successfully!");    
        navigation.navigate("Trade", { initialActiveTab: "sent" });
    }).catch((error) => {
        Alert.alert("Error requesting trade", error.message);
    }).finally(() => {
      setLoading(false);
    });
 }


  const sticker = album.find((s) => s.id === stickerId);

  const addOrRemoveSticker = (sticker: Sticker) => {
    setStickersToOffer((prev) => {
      const exists = prev.some((s) => s.id === sticker.id);
      if (exists) {
        return prev.filter((s) => s.id !== sticker.id);
      } else {
        return [...prev, sticker];
      }
    });
  };

  const renderStickerOption = ({ item }: { item: Sticker }) => (
      <TouchableOpacity
        style={[styles.optionCard, stickersToOffer.some((sticker) => sticker.id === item.id) && styles.optionCardSelected]}
        onPress={() => addOrRemoveSticker(item)}
      >
        <Text style={styles.optionCountry}>{item.country.code}</Text>
        <Text style={styles.optionName} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  

  return (
    <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backBtn}>← Back </Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}> Start Trade</Text>
          </View>

          <View style={styles.tradeContainer}>
            <View>

                <Text style={styles.label}>User</Text>
                <Text style={styles.value}>{user.username}</Text>

                <Text style={styles.label}>You Receive</Text>
                <Text style={styles.value}>{sticker?.name} ({sticker?.code})</Text>

                <Text style={styles.label}>You Give</Text>

                <FlatList 
                    data={album.filter(s => getCardState(s.id).available > 0)}
                    renderItem={renderStickerOption}
                    keyExtractor={(item) => item.id}
                    horizontal
                    style={styles.optionsList}
                    showsHorizontalScrollIndicator={false}
                />

                {stickersToOffer.length > 0 ? (
                stickersToOffer.map((sticker) => (
                    <Text key={sticker.id} style={styles.value}>
                        • {sticker.name} ({sticker.code})
                    </Text>
                ))
                ) : (
                <Text style={styles.info}>Choose a sticker to offer</Text>
                )}

            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        stickersToOffer.length === 0 && { backgroundColor: "#bdbdbd", opacity: 0.8 },
                    ]}
                    onPress={() => handelRequestTrade()}
                    disabled={stickersToOffer.length === 0}
                >
                    <Text style={[styles.buttonText, stickersToOffer.length === 0 && { color: "#eee" }]}>
                        Start Trade
                    </Text>
                </TouchableOpacity>
            </View>
          </View>

    </View>
  );
}
  
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
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
    tradeContainer: { 
        flex: 1, 
        backgroundColor: "#fff", 
        padding: 15, 
        paddingTop: 0,
        margin: 15, 
        borderRadius: 8,
        justifyContent: "space-between",
    },
    value:  { fontSize: 18, fontWeight: "700" },
    label: { fontSize: 14, color: "#666", marginTop: 12 },
    button: {
        backgroundColor: "#2b8cf7",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "600" },
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
        marginTop: 10,
        marginBottom: 4,
    },
    optionCardSelected: { borderColor: "#2196F3", backgroundColor: "#e3f2fd" },
    optionCountry: { fontSize: 11, color: "#666", fontWeight: "bold" },
    optionName: { fontSize: 12, marginTop: 2 },
    footer: { marginTop: 20 },
    info: { fontSize: 14, color: "#999", fontStyle: "italic" , marginTop: 4  },
});
