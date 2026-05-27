import { Bid } from "@/types/auction";

import { supabase } from "./supabase";

type BidRow = {
  id: string;
  auction_item_id: string;
  user_id: string;
  amount: number | string;
  created_at: string;
};

function mapBid(row: BidRow): Bid {
  return {
    id: row.id,
    auctionItemId: row.auction_item_id,
    userId: row.user_id,
    amount: Number(row.amount),
    createdAt: row.created_at,
  };
}

export async function getBids() {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("bids")
      .select("id,auction_item_id,user_id,amount,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Failed to load bids:", error.message);
      return [];
    }

    return (data ?? []).map((row) => mapBid(row as BidRow));
  } catch (error) {
    console.warn("Error loading bids:", error);
    return [];
  }
}

export async function placeSupabaseBid(auctionItemId: string, amount: number) {
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré. Vérifiez votre connexion.");
  }

  try {
    const { error } = await supabase.rpc("place_bid", {
      p_amount: amount,
      p_auction_item_id: auctionItemId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erreur lors de l'enregistrement de l'enchère.");
  }
}
