import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { AuctionItem } from "@/types/auction";
import { getAuctionStatusLabel, isAuctionEnded } from "@/utils/auctionStatus";
import { formatAuctionDate } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";

type AuctionCardProps = {
  item: AuctionItem;
};

export function AuctionCard({ item }: AuctionCardProps) {
  const ended = isAuctionEnded(item);

  return (
    <Link href={{ pathname: "/auction/[id]", params: { id: item.id } }} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}>
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : null}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={[styles.status, ended && styles.endedStatus]}>
              {getAuctionStatusLabel(item)}
            </Text>
          </View>
          <Text style={styles.price}>{formatPrice(item.currentPrice)}</Text>
          <Text style={styles.meta}>Fin : {formatAuctionDate(item.endsAt)}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 12,
  },
  pressedCard: {
    opacity: 0.85,
  },
  image: {
    height: 150,
    width: "100%",
    backgroundColor: "#eeeeee",
  },
  content: {
    padding: 14,
  },
  header: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2933",
  },
  status: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "600",
  },
  endedStatus: {
    color: "#8a1c1c",
  },
  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  meta: {
    marginTop: 4,
    color: "#5f6c7b",
  },
});
