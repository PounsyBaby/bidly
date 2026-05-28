import { AuctionItem } from "@/types/auction";

import { supabase } from "./supabase";

type AuctionItemRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  starting_price: number | string;
  current_price: number | string;
  highest_bidder_id: string | null;
  seller_id: string | null;
  seller_name: string | null;
  ends_at: string;
  status: AuctionItem["status"];
};

export type CreateAuctionItemInput = {
  title: string;
  description: string;
  imageUrl: string | null;
  startingPrice: number;
  endsAt: string;
  sellerId: string;
  sellerName: string;
};

function mapAuctionItem(row: AuctionItemRow): AuctionItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    imageUrl: row.image_url,
    startingPrice: Number(row.starting_price),
    currentPrice: Number(row.current_price),
    highestBidderId: row.highest_bidder_id,
    sellerId: row.seller_id,
    sellerName: row.seller_name ?? "Vendeur",
    endsAt: row.ends_at,
    status: row.status,
  };
}

export async function getAuctionItems() {
  if (!supabase) {
    throw new Error("Configuration Supabase manquante.");
  }

  const { data, error } = await supabase
    .from("auction_items")
    .select(
      "id,title,description,image_url,starting_price,current_price,highest_bidder_id,seller_id,seller_name,ends_at,status",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapAuctionItem(row as AuctionItemRow));
}

export async function createAuctionItem(input: CreateAuctionItemInput) {
  if (!supabase) {
    throw new Error("Supabase configuration is missing.");
  }

  const { error } = await supabase.from("auction_items").insert({
    title: input.title,
    description: input.description,
    image_url: input.imageUrl,
    starting_price: input.startingPrice,
    current_price: input.startingPrice,
    seller_id: input.sellerId,
    seller_name: input.sellerName,
    ends_at: input.endsAt,
    status: "active",
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteAuctionItem(auctionItemId: string) {
  if (!supabase) {
    throw new Error("Supabase configuration is missing.");
  }

  // Vérifier que l'utilisateur est authentifié
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session?.user?.id) {
    throw new Error("Vous devez être connecté pour supprimer une enchère.");
  }

  const userId = sessionData.session.user.id;

  // Récupérer l'enchère pour vérifier le vendeur
  const { data: auctionData, error: getError } = await supabase
    .from("auction_items")
    .select("seller_id")
    .eq("id", auctionItemId)
    .maybeSingle();

  if (getError || !auctionData) {
    throw new Error("Enchère non trouvée.");
  }

  // Vérifier que l'utilisateur est le vendeur
  if (auctionData.seller_id !== userId) {
    throw new Error("Vous pouvez seulement supprimer vos propres enchères.");
  }

  // Supprimer l'enchère
  const { data, error } = await supabase
    .from("auction_items")
    .delete()
    .eq("id", auctionItemId)
    .eq("seller_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(
      "Suppression refusée. Vérifiez que vous êtes le vendeur et que le schema SQL a été relancé.",
    );
  }
}
