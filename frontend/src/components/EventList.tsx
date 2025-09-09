import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";

type EventStruct = {
  id: number;
  name: string;
  date: bigint;
  price: bigint;
  ticketCount: bigint;
  ticketsSold: bigint;
  organizer: string;
};

export default function EventList() {
  const [events, setEvents] = useState<EventStruct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);

        let contract;
        try {
          contract = getContract();
        } catch {
          setError("⚠️ Please connect your wallet first.");
          return;
        }

        const nextId: bigint = await contract.nextEventId();
        const fetchedEvents: EventStruct[] = [];

        for (let i = 0; i < Number(nextId); i++) {
          const raw: any = await contract.events(i);
          fetchedEvents.push({
            id: i,
            name: raw.name,
            date: BigInt(raw.date),
            price: BigInt(raw.price),
            ticketCount: BigInt(raw.ticketCount),
            ticketsSold: BigInt(raw.ticketsSold),
            organizer: raw.organizer,
          });
        }

        setEvents(fetchedEvents);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        setError(err.message ?? "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">⏳ Loading events...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (events.length === 0) return <p className="p-6">No events found.</p>;

  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const isSoldOut = Number(event.ticketsSold) >= Number(event.ticketCount);
        return (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
              <h2 className="text-lg font-bold text-white">{event.name}</h2>
              <p className="text-sm text-blue-100 mt-1">
                📅 {new Date(Number(event.date) * 1000).toLocaleString()}
              </p>
            </div>

            {/* Body */}
            <div className="p-4 space-y-2">
              <p className="text-gray-700">
                💰 <span className="font-semibold">{ethers.formatEther(event.price)}</span> ETH
              </p>
              <p className="text-gray-600">
                🎟️ {Number(event.ticketsSold)} / {Number(event.ticketCount)}{" "}
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                    isSoldOut ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
                >
                  {isSoldOut ? "Sold Out" : "Available"}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                👤 {event.organizer.substring(0, 6)}...{event.organizer.slice(-4)}
              </p>

              <Link
                to={`/event/${event.id}`}
                className="mt-3 inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
