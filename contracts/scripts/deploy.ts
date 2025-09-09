import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", await deployer.getAddress());

  const TicketBooking = await ethers.getContractFactory("TicketBooking");
  const ticketBooking = await TicketBooking.deploy();
  await ticketBooking.waitForDeployment();

  console.log("TicketBooking deployed to:", await ticketBooking.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 