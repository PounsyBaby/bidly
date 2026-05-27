import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/context/AuthContext";
import { AuctionProvider } from "@/context/AuctionContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuctionProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="auction/[id]"
              options={{ title: "Détail de l'enchère" }}
            />
            <Stack.Screen name="login" options={{ title: "Connexion" }} />
            <Stack.Screen name="register" options={{ title: "Inscription" }} />
            <Stack.Screen
              name="create-auction"
              options={{ title: "Créer une enchère" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </AuctionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
