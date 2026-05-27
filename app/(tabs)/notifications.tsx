import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { useAuctions } from "@/context/AuctionContext";
import { Notification } from "@/types/auction";
import { formatAuctionDate } from "@/utils/formatDate";

export default function NotificationsScreen() {
  const { notifications, markNotificationAsRead } = useAuctions();

  function renderNotification({ item }: { item: Notification }) {
    return (
      <View style={styles.card}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.meta}>{formatAuctionDate(item.createdAt)}</Text>
        {!item.read ? (
          <Pressable
            onPress={() => markNotificationAsRead(item.id)}
            style={({ pressed }) => [styles.button, pressed && styles.pressedButton]}
          >
            <Text style={styles.buttonText}>Marquer comme lue</Text>
          </Pressable>
        ) : (
          <Text style={styles.readText}>Lue</Text>
        )}
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={renderNotification}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.title}>Notifications</Text>}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Aucune notification pour le moment.</Text>
      }
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
  card: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  message: {
    color: "#111827",
    fontSize: 16,
    lineHeight: 22,
  },
  meta: {
    marginTop: 8,
    color: "#5f6c7b",
  },
  button: {
    marginTop: 12,
    alignSelf: "flex-start",
    borderRadius: 8,
    backgroundColor: "#0f766e",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pressedButton: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  readText: {
    marginTop: 12,
    color: "#5f6c7b",
    fontWeight: "600",
  },
  emptyText: {
    color: "#5f6c7b",
  },
});
