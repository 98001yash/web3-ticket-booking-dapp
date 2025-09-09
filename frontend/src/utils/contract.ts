// src/utils/contract.ts
import { ethers } from "ethers";
import TicketBooking from "../contracts/TicketBooking.json";
import contractAddress from "../contracts/contract-address.json";

// Keep provider/signer global so they persist
let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;

export function setProviderAndSigner(newProvider: ethers.BrowserProvider, newSigner: ethers.Signer) {
  provider = newProvider;
  signer = newSigner;
}

export function getContract() {
  if (!provider || !signer) {
    throw new Error("Wallet not connected. Please connect your wallet first.");
  }

  return new ethers.Contract(
    contractAddress.TicketBooking,
    TicketBooking.abi,
    signer
  );
}
