import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom"; // ✅ for navigation
import { setProviderAndSigner } from "../utils/contract";

const Navbar: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected! Please install it.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        setAccount(accounts[0]);

        // ✅ Save provider & signer globally
        setProviderAndSigner(provider, signer);
      }
    } catch (error: any) {
      if (error.code === -32002) {
        alert("MetaMask is already processing a connection request. Please open MetaMask.");
      } else {
        console.error("Wallet connection failed:", error);
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then(async (accounts: string[]) => {
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setAccount(accounts[0]);
            setProviderAndSigner(provider, signer); // ✅ preload if already connected
          }
        });
    }
  }, []);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold hover:text-gray-300">
        🎟️ Ticket Booking DApp
      </Link>

      <div className="flex items-center gap-4">
        {/* ✅ Show My Tickets only if wallet is connected */}
        {account && (
          <Link
            to="/my-tickets"
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            My Tickets
          </Link>
        )}

        {account ? (
          <span className="bg-green-600 px-3 py-1 rounded-lg text-sm">
            {account.substring(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
