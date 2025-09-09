🎟️ Web3 Ticket Booking DApp

A decentralized application (DApp) for booking and managing event tickets using Ethereum smart contracts.
This project demonstrates how blockchain can bring transparency and security to event ticketing by preventing fraud and ensuring ownership verification.

✨ Features

🎫 Create Events – Organizers can create events with details (name, date, price, seats).
🛒 Book Tickets – Users can purchase tickets directly on-chain using their wallet.
🔐 Verify Ownership – Each ticket is uniquely tied to the buyer’s wallet address.
📜 View Event Details – Anyone can check available seats and ticket prices.
💳 Secure Payments – Transactions are handled via smart contracts, no intermediaries.

🛠️ Tech Stack
Smart Contracts: Solidity, Hardhat
Frontend: React, TypeScript, TailwindCSS
Blockchain Interaction: Ethers.js

Wallet: MetaMask

🚀 Getting Started
1. Clone Repository
git clone https://github.com/your-username/web3-ticket-booking-dapp.git
cd web3-ticket-booking-dapp

2. Setup Smart Contracts
cd contracts
npm install
npx hardhat compile
npx hardhat node


In another terminal:

npx hardhat run scripts/deploy.ts --network localhost

3. Setup Frontend
cd ../frontend
npm install
npm start

4. Connect MetaMask

Add Localhost 8545 network in MetaMask.

Import Hardhat accounts (from your terminal).

 Usage
Organizer: Create an event.
User: Connect wallet → Select event → Buy ticket.
Ticket Ownership: Verified via smart contract.
History: Transactions recorded on blockchain.

 Project Structure
web3-ticket-booking-dapp/
│── contracts/   # Hardhat project (Solidity smart contracts)
│── frontend/    # React frontend (DApp interface)
│── README.md    # Project documentation

 Future Improvements
Enable reselling of tickets on secondary markets.
Deloy to testnet/mainnet (Goerli, Sepolia, or Polygon).


MIT License © 2025 Your Name
