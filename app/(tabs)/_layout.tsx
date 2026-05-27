import { Tabs } from "expo-router";
import React from "react";

import { useAuctions } from "@/context/AuctionContext";

export default function TabLayout() {
  const { unreadNotificationsCount } = useAuctions();

  return (
    <Tabs screenOptions={{ headerTitleAlign: "center" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Enchères",
        }}
      />
      <Tabs.Screen
        name="my-bids"
        options={{
          title: "Mes offres",
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarBadge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
        }}
      />
    </Tabs>
  );
}
