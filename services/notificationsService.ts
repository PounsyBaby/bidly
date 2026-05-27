import { Notification } from "@/types/auction";

import { supabase } from "./supabase";

type NotificationRow = {
  id: string;
  user_id: string;
  auction_item_id: string;
  message: string;
  read: boolean;
  created_at: string;
};

function mapNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    auctionItemId: row.auction_item_id,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  };
}

export async function getNotifications() {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("id,user_id,auction_item_id,message,read,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Failed to load notifications:", error.message);
      return [];
    }

    return (data ?? []).map((row) => mapNotification(row as NotificationRow));
  } catch (error) {
    console.warn("Error loading notifications:", error);
    return [];
  }
}

export async function markSupabaseNotificationAsRead(id: string) {
  if (!supabase) {
    return;
  }

  try {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);

    if (error) {
      console.warn("Failed to mark notification as read:", error.message);
    }
  } catch (error) {
    console.warn("Error marking notification as read:", error);
  }
}
