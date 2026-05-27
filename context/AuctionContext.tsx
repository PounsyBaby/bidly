import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { deleteAuctionItem, getAuctionItems } from "@/services/auctionsService";
import { getBids, placeSupabaseBid } from "@/services/bidsService";
import {
  getNotifications,
  markSupabaseNotificationAsRead,
} from "@/services/notificationsService";
import { AuctionItem, Bid, Notification, TrackedAuction } from "@/types/auction";
import { isAuctionEnded } from "@/utils/auctionStatus";
import { formatPrice } from "@/utils/formatPrice";

type BidResult = {
  success: boolean;
  message: string;
};

type AuctionContextValue = {
  currentUserId: string | null;
  auctions: AuctionItem[];
  auctionsError: string | null;
  auctionsLoading: boolean;
  bids: Bid[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  getAuctionById: (id: string) => AuctionItem | undefined;
  getBidsForAuction: (auctionItemId: string) => Bid[];
  placeBid: (auctionItemId: string, rawAmount: string) => Promise<BidResult>;
  deleteAuction: (auctionItemId: string) => Promise<BidResult>;
  trackedAuctions: TrackedAuction[];
  markNotificationAsRead: (id: string) => void;
  reloadAuctions: () => Promise<void>;
};

const AuctionContext = createContext<AuctionContextValue | null>(null);

function sortBidsByAmount(bids: Bid[]) {
  return [...bids].sort((first, second) => second.amount - first.amount);
}

function parseBidAmount(rawAmount: string) {
  const amount = Number(rawAmount.replace(",", "."));
  return Number.isFinite(amount) ? amount : null;
}

export function AuctionProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(true);
  const [auctionsError, setAuctionsError] = useState<string | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function loadAuctions(showLoading = true) {
    if (showLoading) {
      setAuctionsLoading(true);
    }

    setAuctionsError(null);

    try {
      const supabaseAuctions = await getAuctionItems();
      setAuctions(supabaseAuctions);

      if (currentUserId) {
        try {
          const [supabaseBids, supabaseNotifications] = await Promise.all([
            getBids(),
            getNotifications(),
          ]);
          setBids(supabaseBids);
          setNotifications(supabaseNotifications);
        } catch (error) {
          console.warn("Failed to load bids/notifications:", error);
          setBids([]);
          setNotifications([]);
        }
      } else {
        setBids([]);
        setNotifications([]);
      }
    } catch (error) {
      setAuctions([]);
      setBids([]);
      setNotifications([]);
      setAuctionsError(
        error instanceof Error
          ? `Impossible de charger les enchères : ${error.message}`
          : "Impossible de charger les enchères. Vérifiez votre connexion."
      );
    } finally {
      if (showLoading) {
        setAuctionsLoading(false);
      }
    }
  }

  useEffect(() => {
    loadAuctions();
  }, [currentUserId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadAuctions(false);
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentUserId]);

  function getAuctionById(id: string) {
    return auctions.find((item) => item.id === id);
  }

  function getBidsForAuction(auctionItemId: string) {
    return sortBidsByAmount(bids.filter((bid) => bid.auctionItemId === auctionItemId));
  }

  async function createBid(
    auctionItemId: string,
    rawAmount: string,
    userId: string | null
  ): Promise<BidResult> {
    const item = getAuctionById(auctionItemId);
    const amount = parseBidAmount(rawAmount);

    if (!userId) {
      return { success: false, message: "Connectez-vous pour placer une enchère." };
    }

    if (!item) {
      return { success: false, message: "Enchère introuvable." };
    }

    if (item.status !== "active" || isAuctionEnded(item)) {
      return { success: false, message: "Cette enchère est terminée." };
    }

    if (item.sellerId === userId) {
      return { success: false, message: "Vous ne pouvez pas enchérir sur votre propre vente." };
    }

    if (amount === null || amount <= 0) {
      return { success: false, message: "Le montant doit être un nombre valide." };
    }

    if (amount <= item.currentPrice) {
      return {
        success: false,
        message: `Le montant doit être supérieur à ${formatPrice(item.currentPrice)}.`,
      };
    }

    if (!item.highestBidderId && amount < item.startingPrice) {
      return {
        success: false,
        message: `Le premier montant doit être au moins ${formatPrice(item.startingPrice)}.`,
      };
    }

    try {
      await placeSupabaseBid(auctionItemId, amount);
      await loadAuctions(false);
      return { success: true, message: "Votre enchère a été enregistrée." };
    } catch (error) {
      console.warn("Bid placement error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? `Impossible d'enregistrer l'enchère : ${error.message}`
            : "Impossible d'enregistrer l'enchère.",
      };
    }
  }

  async function removeAuction(auctionItemId: string): Promise<BidResult> {
    const item = getAuctionById(auctionItemId);

    if (!currentUserId) {
      return { success: false, message: "Connectez-vous pour supprimer une vente." };
    }

    if (!item) {
      return { success: false, message: "Enchère introuvable." };
    }

    if (item.sellerId !== currentUserId) {
      return { success: false, message: "Vous pouvez supprimer uniquement vos propres ventes." };
    }

    try {
      await deleteAuctionItem(auctionItemId);
      await loadAuctions(false);
      return { success: true, message: "La vente a été supprimée." };
    } catch (error) {
      console.warn("Auction deletion error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? `Impossible de supprimer la vente : ${error.message}`
            : "Impossible de supprimer la vente.",
      };
    }
  }

  const trackedAuctions = useMemo(() => {
    if (!currentUserId) {
      return [];
    }

    const userBids = bids.filter((bid) => bid.userId === currentUserId);
    const latestBidByAuction = new Map<string, Bid>();

    userBids.forEach((bid) => {
      const current = latestBidByAuction.get(bid.auctionItemId);

      if (!current || new Date(bid.createdAt) > new Date(current.createdAt)) {
        latestBidByAuction.set(bid.auctionItemId, bid);
      }
    });

    return Array.from(latestBidByAuction.values())
      .map((latestUserBid) => {
        const item = auctions.find((auction) => auction.id === latestUserBid.auctionItemId);

        if (!item) {
          return null;
        }

        return {
          item,
          latestUserBid,
          isWinning: item.highestBidderId === currentUserId,
        };
      })
      .filter((trackedAuction): trackedAuction is TrackedAuction => trackedAuction !== null);
  }, [auctions, bids, currentUserId]);

  function markNotificationAsRead(id: string) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    markSupabaseNotificationAsRead(id).catch(() => {
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: false } : notification
        )
      );
    });
  }

  const userNotifications = notifications.filter(
    (notification) => notification.userId === currentUserId
  );
  const unreadNotificationsCount = userNotifications.filter(
    (notification) => !notification.read
  ).length;

  const value: AuctionContextValue = {
    currentUserId,
    auctions,
    auctionsError,
    auctionsLoading,
    bids,
    notifications: userNotifications,
    unreadNotificationsCount,
    getAuctionById,
    getBidsForAuction,
    placeBid: (auctionItemId, rawAmount) => createBid(auctionItemId, rawAmount, currentUserId),
    deleteAuction: removeAuction,
    trackedAuctions,
    markNotificationAsRead,
    reloadAuctions: loadAuctions,
  };

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
}

export function useAuctions() {
  const context = useContext(AuctionContext);

  if (!context) {
    throw new Error("useAuctions must be used inside AuctionProvider");
  }

  return context;
}
