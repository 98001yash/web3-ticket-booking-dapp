// src/components/Dashboard.tsx
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          🎟️ Welcome to <span className="text-blue-600">Ticket DApp</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Manage events, buy tickets, and explore the decentralized world of event booking.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          to="/events"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md rounded-xl p-6 hover:scale-105 transform transition duration-300"
        >
          <h2 className="text-2xl font-bold">📋 View Events</h2>
          <p className="text-blue-100 mt-2">Browse and book available events</p>
        </Link>

        <Link
          to="/create"
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md rounded-xl p-6 hover:scale-105 transform transition duration-300"
        >
          <h2 className="text-2xl font-bold">➕ Create Event</h2>
          <p className="text-green-100 mt-2">Organize and launch your own event</p>
        </Link>

        <Link
          to="/my-tickets"
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md rounded-xl p-6 hover:scale-105 transform transition duration-300"
        >
          <h2 className="text-2xl font-bold">🎟️ My Tickets</h2>
          <p className="text-purple-100 mt-2">View tickets you own</p>
        </Link>

        <Link
          to="/profile"
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md rounded-xl p-6 hover:scale-105 transform transition duration-300"
        >
          <h2 className="text-2xl font-bold">👤 Profile</h2>
          <p className="text-orange-100 mt-2">Check your wallet & activity</p>
        </Link>
      </div>
    </div>
  );
}
