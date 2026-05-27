import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { useAuctions } from "@/context/AuctionContext";
import { TrackedAuction } from "@/types/auction";
import { getAuctionStatusLabel } from "@/utils/auctionStatus";
import { formatPrice } from "@/utils/formatPrice";

export default function MyBidsScreen() {
  const { trackedAuctions } = useAuctions();

  function renderTrackedAuction({ item: trackedAuction }: { item: TrackedAuction }) {
    const { item, latestUserBid, isWinning } = trackedAuction;

    return (
      <Link href={{ pathname: "/auction/[id]", params: { id: item.id } }} style={styles.link}>
        <View style={styles.card}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Votre dernière offre</Text>
            <Text style={styles.value}>{formatPrice(latestUserBid.amount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Prix actuel</Text>
            <Text style={styles.value}>{formatPrice(item.currentPrice)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Statut</Text>
            <Text style={styles.value}>{getAuctionStatusLabel(item)}</Text>
          </View>
          <Text style={[styles.result, isWinning ? styles.winning : styles.outbid]}>
            {isWinning ? "Vous êtes en tête." : "Vous avez été dépassé."}
          </Text>
        </View>
      </Link>
    );
  }

  return (
    <FlatList
      data={trackedAuctions}
      keyExtractor={({ item }) => item.id}
      renderItem={renderTrackedAuction}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.title}>Mes offres</Text>}
      ListEmptyComponent={<Text style={styles.emptyText}>Aucune offre placée pour le moment.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f7f9",
    padding: 24,
  },
  title: {
    marginBottom: 16,
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  link: {
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  itemTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  row: {
    marginTop: 8,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  label: {
    color: "#5f6c7b",
  },
  value: {
    color: "#111827",
    fontWeight: "600",
    textAlign: "right",
  },
  result: {
    marginTop: 12,
    fontWeight: "700",
  },
  winning: {
    color: "#166534",
  },
  outbid: {
    color: "#8a1c1c",
  },
  emptyText: {
    color: "#5f6c7b",
  },
});
