// src/components/EventDetails.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";

type EventStruct = {
  name: string;
  date: bigint;
  price: bigint;
  ticketCount: bigint;
  ticketsSold: bigint;
  organizer: string;
};

export default function EventDetails() {
  const { id } = useParams();
  const [eventData, setEventData] = useState<EventStruct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [txLoading, setTxLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        const contract = getContract();
        const raw = await (contract as any)["getEventData"](BigInt(id));

        const e: EventStruct = {
          name: raw.name ?? raw[0],
          date: BigInt(raw.date ?? raw[1]),
          price: BigInt(raw.price ?? raw[2]),
          ticketCount: BigInt(raw.ticketCount ?? raw[3]),
          ticketsSold: BigInt(raw.ticketsSold ?? raw[4]),
          organizer: raw.organizer ?? raw[5],
        };

        setEventData(e);

        // fetch account
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        setCurrentAccount((await signer.getAddress()).toLowerCase());
      } catch (err: any) {
        console.error("Error fetching event:", err);
        setError(err.message ?? "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  async function handleBuyTicket() {
    if (!id || !eventData) return;
    try {
      setTxLoading(true);
      const contract = getContract();
      const totalPrice = eventData.price * BigInt(quantity);

      const tx = await (contract as any).buyTicket(BigInt(id), quantity, {
        value: totalPrice,
      });

      await tx.wait();
      alert("🎉 Ticket purchased successfully!");
    } catch (err: any) {
      console.error("Buy ticket error:", err);
      alert(err.message ?? "Failed to buy ticket");
    } finally {
      setTxLoading(false);
    }
  }

  async function handleWithdraw() {
    if (!id) return;
    try {
      setTxLoading(true);
      const contract = getContract();
      const tx = await (contract as any).withdraw(BigInt(id));
      await tx.wait();
      alert("✅ Funds withdrawn successfully!");
    } catch (err: any) {
      console.error("Withdraw error:", err);
      alert(err.message ?? "Failed to withdraw funds");
    } finally {
      setTxLoading(false);
    }
  }

  if (loading) return <p className="p-6">⏳ Loading event...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!eventData) return <p className="p-6">No event found.</p>;

  const isOrganizer =
    currentAccount && currentAccount === eventData.organizer.toLowerCase();
  const isPastEvent = Number(eventData.date) < Date.now() / 1000;
  const isSoldOut =
    Number(eventData.ticketsSold) >= Number(eventData.ticketCount);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl shadow-md">
        <h1 className="text-2xl font-bold">{eventData.name}</h1>
        <p className="mt-1 text-blue-100">
          📅 {new Date(Number(eventData.date) * 1000).toLocaleString()}
        </p>
      </div>

      {/* Body */}
      <div className="bg-white border border-gray-200 shadow-md rounded-b-2xl p-6 space-y-3">
        <p>
          💰 <span className="font-semibold">{ethers.formatEther(eventData.price)}</span> ETH
        </p>
        <p>
          🎟️ {Number(eventData.ticketsSold)} / {Number(eventData.ticketCount)}
          <span
            className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
              isSoldOut ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}
          >
            {isSoldOut ? "Sold Out" : "Available"}
          </span>
        </p>
        <p className="text-gray-600 text-sm">
          👤 Organizer:{" "}
          {eventData.organizer.substring(0, 6)}...{eventData.organizer.slice(-4)}
        </p>

        {/* Actions */}
        <div className="mt-6 border-t pt-4">
          {!isOrganizer ? (
            <>
              <h2 className="text-lg font-semibold mb-2">Buy Tickets</h2>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border p-2 rounded-lg w-24 focus:ring focus:ring-indigo-300"
                />
                <button
                  onClick={handleBuyTicket}
                  disabled={txLoading || isSoldOut || isPastEvent}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {txLoading ? "Processing..." : "Buy Ticket"}
                </button>
              </div>
            </>
          ) : (
            isPastEvent && (
              <button
                onClick={handleWithdraw}
                disabled={txLoading}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
              >
                {txLoading ? "Withdrawing..." : "Withdraw Funds"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
