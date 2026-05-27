import { AuctionItem } from "@/types/auction";

export function isAuctionEnded(item: AuctionItem) {
  return item.status !== "active" || new Date(item.endsAt).getTime() <= Date.now();
}

export function getAuctionStatusLabel(item: AuctionItem) {
  if (item.status === "cancelled") {
    return "Annulée";
  }

  return isAuctionEnded(item) ? "Terminée" : "Active";
}
