import { expect } from "chai";
import { ethers } from "hardhat";

describe("TicketBooking", function () {
  it("should allow organizer to create an event and users to buy tickets", async function () {
    // Get signers
    const [organizer, buyer] = await ethers.getSigners();

    // Deploy contract
    const TicketBooking = await ethers.getContractFactory("TicketBooking", organizer);
    const ticketBooking = await TicketBooking.deploy();
    await ticketBooking.waitForDeployment();

    // Organizer creates an event
    const tx = await ticketBooking
      .connect(organizer)
      .createEvent(
        "Concert",
        Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        ethers.parseEther("0.1"),
        100
      );
    await tx.wait();

    // Fetch event details from public mapping
    const [name, date, price, ticketCount, ticketsSold, organizerAddr] =
      await ticketBooking.events(0);

    expect(name).to.equal("Concert");
    expect(price).to.equal(ethers.parseEther("0.1"));
    expect(ticketCount).to.equal(100n);
    expect(ticketsSold).to.equal(0n);
    expect(organizerAddr).to.equal(await organizer.getAddress());

    // Buyer purchases 2 tickets
    const buyTx = await ticketBooking.connect(buyer).buyTicket(0, 2, {
      value: ethers.parseEther("0.2"),
    });
    await buyTx.wait();

    const ticketsOwned = await ticketBooking.ticketsOwned(
      0,
      await buyer.getAddress()
    );
    expect(ticketsOwned).to.equal(2n);

    // Verify ticketsSold updated
    const [, , , , ticketsSoldAfter] = await ticketBooking.events(0);
    expect(ticketsSoldAfter).to.equal(2n);
  });
});
