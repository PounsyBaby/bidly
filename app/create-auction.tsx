import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useAuctions } from "@/context/AuctionContext";
import { createAuctionItem } from "@/services/auctionsService";

function parsePrice(rawPrice: string) {
  const price = Number(rawPrice.replace(",", "."));
  return Number.isFinite(price) ? price : null;
}

function parseEndDate(rawDate: string) {
  const normalizedDate = rawDate.trim().replace(" ", "T");
  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function isPickedImage(imageUrl: string) {
  return imageUrl.startsWith("data:");
}

export default function CreateAuctionScreen() {
  const { user, displayName } = useAuth();
  const { reloadAuctions } = useAuctions();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setFeedback("Autorisez l'accès aux photos pour choisir une image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      mediaTypes: ["images"],
      quality: 0.35,
    });

    if (result.canceled) {
      return;
    }

    const selectedImage = result.assets[0];

    if (!selectedImage.base64) {
      setFeedback("Impossible de préparer cette image. Essayez une autre image ou une URL.");
      return;
    }

    const mimeType = selectedImage.mimeType ?? "image/jpeg";
    setImageUrl(`data:${mimeType};base64,${selectedImage.base64}`);
    setFeedback("");
  }

  async function handleCreateAuction() {
    const price = parsePrice(startingPrice);
    const endDate = parseEndDate(endsAt);

    if (!user) {
      setFeedback("Connectez-vous pour créer une enchère.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setFeedback("Le titre et la description sont obligatoires.");
      return;
    }

    if (price === null || price <= 0) {
      setFeedback("Le prix de départ doit être un nombre positif.");
      return;
    }

    if (!endDate || endDate <= new Date()) {
      setFeedback("La date de fin doit être une date future.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      await createAuctionItem({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || null,
        startingPrice: price,
        endsAt: endDate.toISOString(),
        sellerId: user.id,
        sellerName: displayName ?? user.email?.split("@")[0] ?? "Vendeur",
      });
      await reloadAuctions();
      router.replace("/");
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? `Impossible de créer l'enchère : ${error.message}`
          : "Impossible de créer l'enchère."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Nouvelle enchère</Text>
          <Text style={styles.subtitle}>Ajoutez un objet simple à vendre.</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Titre de l'objet"
            style={styles.input}
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            multiline
            style={[styles.input, styles.multilineInput]}
          />
          <TextInput
            value={startingPrice}
            onChangeText={setStartingPrice}
            placeholder="Prix de départ en euros"
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <TextInput
            value={endsAt}
            onChangeText={setEndsAt}
            placeholder="Date de fin, ex: 2026-05-28 18:00"
            style={styles.input}
          />
          <TextInput
            value={isPickedImage(imageUrl) ? "" : imageUrl}
            onChangeText={setImageUrl}
            placeholder={
              isPickedImage(imageUrl)
                ? "Image choisie depuis l'appareil"
                : "URL d'image optionnelle"
            }
            autoCapitalize="none"
            style={styles.input}
          />
          <Pressable onPress={handlePickImage} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Choisir une image</Text>
          </Pressable>

          {imageUrl ? (
            <View>
              <Image source={{ uri: imageUrl }} style={styles.previewImage} />
              <Pressable onPress={() => setImageUrl("")} style={styles.removeImageButton}>
                <Text style={styles.removeImageButtonText}>{"Retirer l'image"}</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable
            disabled={submitting}
            onPress={handleCreateAuction}
            style={({ pressed }) => [
              styles.button,
              submitting && styles.disabledButton,
              pressed && !submitting && styles.pressedButton,
            ]}
          >
            <Text style={styles.buttonText}>
              {submitting ? "Création..." : "Créer l'enchère"}
            </Text>
          </Pressable>

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#f6f7f9",
  },
  container: {
    padding: 24,
  },
  form: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: "#5f6c7b",
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  secondaryButton: {
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#0f766e",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#0f766e",
    fontWeight: "700",
  },
  previewImage: {
    width: "100%",
    height: 190,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  removeImageButton: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 8,
  },
  removeImageButtonText: {
    color: "#8a1c1c",
    fontWeight: "600",
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#0f766e",
    paddingVertical: 13,
  },
  pressedButton: {
    opacity: 0.85,
  },
  disabledButton: {
    backgroundColor: "#8a8f98",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  feedback: {
    marginTop: 12,
    color: "#8a1c1c",
  },
});
