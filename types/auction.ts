export type AuctionStatus = "active" | "ended" | "cancelled";

export type AuctionItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startingPrice: number;
  currentPrice: number;
  highestBidderId: string | null;
  sellerId: string | null;
  sellerName: string;
  endsAt: string;
  status: AuctionStatus;
};

export type Bid = {
  id: string;
  auctionItemId: string;
  userId: string;
  amount: number;
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  auctionItemId: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type TrackedAuction = {
  item: AuctionItem;
  latestUserBid: Bid;
  isWinning: boolean;
};
