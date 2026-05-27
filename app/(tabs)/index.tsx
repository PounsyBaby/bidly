import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AuctionCard } from "@/components/AuctionCard";
import { useAuth } from "@/context/AuthContext";
import { useAuctions } from "@/context/AuctionContext";
import { AuctionItem } from "@/types/auction";

export default function HomeScreen() {
  const { user, displayName, signOut } = useAuth();
  const { auctions, auctionsError, auctionsLoading, reloadAuctions } = useAuctions();
  const [search, setSearch] = useState("");

  const filteredAuctions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return auctions;
    }

    return auctions.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        (item.description?.toLowerCase().includes(keyword) ?? false)
    );
  }, [auctions, search]);

  function renderAuction({ item }: { item: AuctionItem }) {
    return <AuctionCard item={item} />;
  }

  return (
    <FlatList
      data={filteredAuctions}
      keyExtractor={(item) => item.id}
      renderItem={renderAuction}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Bidly</Text>
          <Text style={styles.subtitle}>Enchères simples pour la démo.</Text>
          <Text style={styles.sourceText}>Source : Supabase</Text>

          <View style={styles.authBox}>
            {user ? (
              <View style={styles.connectedBox}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(displayName ?? "U").trim().charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.accountTextBox}>
                  <Text style={styles.accountLabel}>Connecté</Text>
                  <Text style={styles.authText}>{displayName ?? "Utilisateur"}</Text>
                </View>
                <Pressable
                  onPress={signOut}
                  style={({ pressed }) => [styles.logoutButton, pressed && styles.pressedButton]}
                >
                  <Text style={styles.logoutButtonText}>Déconnexion</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.authActions}>
                <Pressable
                  onPress={() => router.push("/login")}
                  style={({ pressed }) => [
                    styles.primaryAuthButton,
                    pressed && styles.pressedButton,
                  ]}
                >
                  <Text style={styles.primaryAuthButtonText}>Connexion</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push("/register")}
                  style={({ pressed }) => [
                    styles.secondaryAuthButton,
                    pressed && styles.pressedButton,
                  ]}
                >
                  <Text style={styles.secondaryAuthButtonText}>Inscription</Text>
                </Pressable>
              </View>
            )}
          </View>

          {user ? (
            <Pressable
              onPress={() => router.push("/create-auction")}
              style={({ pressed }) => [styles.createButton, pressed && styles.pressedButton]}
            >
              <Text style={styles.createButtonText}>Créer une enchère</Text>
            </Pressable>
          ) : null}

          {auctionsLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>Chargement des enchères...</Text>
            </View>
          ) : null}

          {auctionsError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{auctionsError}</Text>
              <Pressable
                onPress={reloadAuctions}
                style={({ pressed }) => [styles.retryButton, pressed && styles.pressedButton]}
              >
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </Pressable>
            </View>
          ) : null}

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher une enchère"
            style={styles.searchInput}
          />
        </View>
      }
      ListEmptyComponent={<Text style={styles.emptyText}>Aucune enchère trouvée.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f7f9",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#5f6c7b",
  },
  sourceText: {
    marginTop: 8,
    color: "#5f6c7b",
    fontSize: 13,
  },
  authBox: {
    marginTop: 16,
  },
  connectedBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d7ede9",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 10,
    gap: 10,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0f766e",
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  accountTextBox: {
    flex: 1,
  },
  accountLabel: {
    color: "#6b7280",
    fontSize: 12,
  },
  authText: {
    marginTop: 2,
    color: "#111827",
    fontWeight: "700",
  },
  authActions: {
    flexDirection: "row",
    gap: 10,
  },
  primaryAuthButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0f766e",
    borderRadius: 8,
    backgroundColor: "#0f766e",
    paddingVertical: 12,
  },
  primaryAuthButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  secondaryAuthButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9ccfca",
    borderRadius: 8,
    backgroundColor: "#eef8f6",
    paddingVertical: 12,
  },
  secondaryAuthButtonText: {
    color: "#0b5f59",
    fontWeight: "700",
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  logoutButtonText: {
    color: "#374151",
    fontWeight: "700",
  },
  createButton: {
    marginTop: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#111827",
    paddingVertical: 12,
  },
  createButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  searchInput: {
    marginTop: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  loadingRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#5f6c7b",
  },
  errorBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#f0caca",
    borderRadius: 8,
    backgroundColor: "#fff5f5",
    padding: 12,
  },
  errorText: {
    color: "#8a1c1c",
  },
  retryButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 8,
    backgroundColor: "#8a1c1c",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  pressedButton: {
    opacity: 0.85,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 24,
    color: "#5f6c7b",
    textAlign: "center",
  },
});
