// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TicketBooking {
    struct EventData {
        string name;
        uint date;
        uint price;
        uint ticketCount;
        uint ticketsSold;
        address payable organizer;
    }

    uint public nextEventId;
    mapping(uint => EventData) public events;
    mapping(uint => mapping(address => uint)) public ticketsOwned;

    event EventCreated(
        uint indexed eventId,
        string name,
        uint date,
        uint price,
        uint ticketCount,
        address indexed organizer
    );

    event TicketPurchased(uint indexed eventId, address indexed buyer, uint quantity);

    modifier onlyOrganizer(uint eventId) {
        require(msg.sender == events[eventId].organizer, "Not event organizer");
        _;
    }

    function createEvent(
        string memory name,
        uint date,
        uint price,
        uint ticketCount
    ) external {
        require(date > block.timestamp, "Event date must be in the future");
        require(ticketCount > 0, "Must create at least 1 ticket");

        events[nextEventId] = EventData(
            name,
            date,
            price,
            ticketCount,
            0,
            payable(msg.sender)
        );

        emit EventCreated(nextEventId, name, date, price, ticketCount, msg.sender);
        nextEventId++;
    }

    function buyTicket(uint eventId, uint quantity) external payable {
        EventData storage _event = events[eventId];
        require(_event.date > block.timestamp, "Event has already happened");
        require(_event.ticketsSold + quantity <= _event.ticketCount, "Not enough tickets");
        require(msg.value == _event.price * quantity, "Incorrect ETH sent");

        _event.ticketsSold += quantity;
        ticketsOwned[eventId][msg.sender] += quantity;

        emit TicketPurchased(eventId, msg.sender, quantity);
    }

    function withdraw(uint eventId) external onlyOrganizer(eventId) {
        EventData storage _event = events[eventId];
        require(_event.date < block.timestamp, "Event has not ended yet");

        uint balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        _event.organizer.transfer(balance);
    }

    // ✅ Renamed from getEvent → getEventData to avoid ethers.js conflict
    function getEventData(uint eventId) external view returns (EventData memory) {
        return events[eventId];
    }
}
