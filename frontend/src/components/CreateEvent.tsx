// src/pages/CreateEvent.tsx
import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";

export default function CreateEvent() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [ticketCount, setTicketCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      let contract;
      try {
        contract = getContract();
      } catch {
        alert("⚠️ Please connect your wallet before creating an event.");
        return;
      }

      const unixDate = Math.floor(new Date(date).getTime() / 1000);
      const ticketPrice = ethers.parseEther(price.toString());

      const tx = await contract.createEvent(
        name,
        unixDate,
        ticketPrice,
        Number(ticketCount)
      );
      await tx.wait();

      const nextId = await contract.nextEventId();
      setEventId(Number(nextId) - 1);

      setName("");
      setDate("");
      setPrice("");
      setTicketCount("");
    } catch (err: any) {
      console.error(err);
      alert("❌ Failed to create event: " + (err.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl shadow-md">
        <h1 className="text-2xl font-bold">✨ Create New Event</h1>
        <p className="text-blue-100 mt-1">
          Fill in the details below to launch your event on-chain.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-b-2xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="text"
            placeholder="Ticket Price (ETH)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="number"
            placeholder="Number of Tickets"
            value={ticketCount}
            onChange={(e) => setTicketCount(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "⏳ Creating..." : "🚀 Create Event"}
          </button>
        </form>

        {eventId !== null && (
          <div className="mt-6 text-center">
            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              🎉 Event created successfully! ID: <b>{eventId}</b>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
