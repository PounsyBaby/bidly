import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuctions } from "@/context/AuctionContext";
import { getAuctionStatusLabel, isAuctionEnded } from "@/utils/auctionStatus";
import { formatAuctionDate } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";

export default function AuctionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    currentUserId,
    deleteAuction,
    getAuctionById,
    getBidsForAuction,
    placeBid,
  } = useAuctions();
  const [amount, setAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const item = getAuctionById(id);

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Enchère introuvable.</Text>
      </View>
    );
  }

  const auction = item;
  const ended = isAuctionEnded(auction);
  const isSeller = auction.sellerId === currentUserId;
  const bidDisabled = ended || submitting || isSeller;
  const bids = getBidsForAuction(auction.id);

  async function handleBid() {
    setSubmitting(true);
    const result = await placeBid(auction.id, amount);
    setSubmitting(false);
    setFeedback(result.message);

    if (result.success) {
      setAmount("");
    }
  }

  async function confirmDeleteAuction() {
    const result = await deleteAuction(auction.id);
    setFeedback(result.message);

    if (result.success) {
      router.replace("/");
    }
  }

  function handleDeleteAuction() {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Supprimer cette vente ? Cette action supprimera aussi les offres liées à cette vente."
      );

      if (confirmed) {
        confirmDeleteAuction();
      }

      return;
    }

    Alert.alert(
      "Supprimer la vente",
      "Cette action supprimera aussi les offres liées à cette vente.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: confirmDeleteAuction },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {auction.imageUrl ? <Image source={{ uri: auction.imageUrl }} style={styles.image} /> : null}

      <View style={styles.section}>
        <Text style={styles.title}>{auction.title}</Text>
        <Text style={styles.description}>{auction.description}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Statut</Text>
          <Text style={styles.value}>{getAuctionStatusLabel(auction)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Prix de départ</Text>
          <Text style={styles.value}>{formatPrice(auction.startingPrice)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Prix actuel</Text>
          <Text style={styles.currentPrice}>{formatPrice(auction.currentPrice)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Fin</Text>
          <Text style={styles.value}>{formatAuctionDate(auction.endsAt)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Vendeur</Text>
          <Text style={styles.value}>{auction.sellerName}</Text>
        </View>

        {isSeller ? (
          <Pressable onPress={handleDeleteAuction} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Supprimer cette vente</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Placer une enchère</Text>
        {isSeller ? (
          <Text style={styles.ownerText}>Vous ne pouvez pas enchérir sur votre propre vente.</Text>
        ) : null}
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Montant en euros"
          keyboardType="decimal-pad"
          editable={!bidDisabled}
          style={[styles.input, bidDisabled && styles.disabledInput]}
        />
        <Pressable
          disabled={bidDisabled}
          onPress={handleBid}
          style={({ pressed }) => [
            styles.button,
            bidDisabled && styles.disabledButton,
            pressed && !bidDisabled && styles.pressedButton,
          ]}
        >
          <Text style={styles.buttonText}>
            {ended
              ? "Enchère terminée"
              : isSeller
                ? "Votre vente"
                : submitting
                  ? "Enregistrement..."
                  : "Enchérir"}
          </Text>
        </Pressable>

        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dernières offres</Text>
        {bids.length === 0 ? (
          <Text style={styles.emptyText}>Aucune offre pour le moment.</Text>
        ) : (
          bids.map((bid) => (
            <View key={bid.id} style={styles.bidRow}>
              <Text style={styles.value}>{formatPrice(bid.amount)}</Text>
              <Text style={styles.meta}>
                {bid.userId === currentUserId ? "Vous" : "Autre utilisateur"}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f7f9",
    padding: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    height: 220,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#eeeeee",
  },
  section: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    marginTop: 8,
    color: "#4b5563",
    lineHeight: 21,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  infoRow: {
    marginTop: 12,
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
  currentPrice: {
    color: "#0f766e",
    fontSize: 18,
    fontWeight: "700",
  },
  deleteButton: {
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#b42318",
    borderRadius: 8,
    paddingVertical: 12,
  },
  deleteButtonText: {
    color: "#b42318",
    fontWeight: "700",
  },
  ownerText: {
    marginBottom: 12,
    color: "#5f6c7b",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#eeeeee",
  },
  button: {
    marginTop: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#0f766e",
    paddingVertical: 13,
  },
  disabledButton: {
    backgroundColor: "#8a8f98",
  },
  pressedButton: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  feedback: {
    marginTop: 10,
    color: "#374151",
  },
  bidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingVertical: 10,
  },
  meta: {
    color: "#5f6c7b",
  },
  emptyText: {
    color: "#5f6c7b",
  },
  errorText: {
    color: "#8a1c1c",
  },
});
