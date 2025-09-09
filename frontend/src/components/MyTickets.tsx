import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";

type TicketInfo = {
  eventId: number;
  name: string;
  date: bigint;
  price: bigint;
  quantity: bigint;
};

export default function MyTickets() {
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        setError(null);

        const contract = getContract();
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const totalEvents = await contract.nextEventId();

        const owned: TicketInfo[] = [];
        for (let i = 0; i < Number(totalEvents); i++) {
          const qty: bigint = await contract.ticketsOwned(i, userAddress);

          if (qty > 0n) {
            const raw = await contract.getEventData(BigInt(i));
            const e: TicketInfo = {
              eventId: i,
              name: raw.name,
              date: BigInt(raw.date),
              price: BigInt(raw.price),
              quantity: qty,
            };
            owned.push(e);
          }
        }

        setTickets(owned);
      } catch (err: any) {
        console.error("Fetch tickets error:", err);
        setError(err.message ?? "Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  if (loading) return <p className="p-6">⏳ Loading your tickets...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white p-6 rounded-t-2xl shadow-md">
        <h1 className="text-2xl font-bold">🎟️ My Tickets</h1>
        <p className="text-green-100 mt-1">
          View all the tickets you’ve purchased.
        </p>
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-gray-200 rounded-b-2xl shadow-md p-6">
        {tickets.length === 0 ? (
          <p className="text-gray-600 text-center py-10">
            You don’t own any tickets yet.  
            <span className="block mt-1">Go grab some from events 🎉</span>
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {tickets.map((t) => (
              <li
                key={t.eventId}
                className="border rounded-xl p-5 shadow-sm hover:shadow-lg transition bg-gradient-to-br from-white to-gray-50"
              >
                <h2 className="text-lg font-semibold text-indigo-700">
                  {t.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  📅 {new Date(Number(t.date) * 1000).toLocaleString()}
                </p>
                <p className="mt-1">
                  💰{" "}
                  <span className="font-medium text-green-600">
                    {ethers.formatEther(t.price)}
                  </span>{" "}
                  ETH
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  🎟️ Quantity:{" "}
                  <span className="font-medium">{t.quantity.toString()}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
