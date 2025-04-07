// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ResearchFunding {
    address public owner;
    uint public projectCount = 0;
    uint public projectCreationFee = 0.005 ether; // Small fee to prevent spam
    
    struct Project {
        uint id;
        string name;
        string description;
        uint currentFunding;
        address payable recipient;
        bool isActive;
    }

    struct Transaction {
        uint projectId;
        uint amount;
        address user;
        string txType; // "fund" or "withdraw"
        uint timestamp;
    }
    
    mapping(uint => Project) public projects;

    Transaction[] public transactions;
    mapping(uint => uint[]) public projectTransactions;
    
    event ProjectCreated(uint id, string name, address recipient, bool isActive);
    event Funded(uint id, uint amount, address donor);
    event Withdrawn(uint id, uint amount, address recipient);
    event ProjectDeactivated(uint id);
    event ProjectActivated(uint id);
    event FeeUpdated(uint newFee);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
    modifier onlyRecipient(uint _id) {
        require(msg.sender == projects[_id].recipient, "Only the project recipient can withdraw");
        _;
    }
    
    modifier projectIsActive(uint _id) {
        require(projects[_id].isActive, "Project is not active");
        _;
    }
    
    modifier onlyOwnerOrRecipient(uint _id) {
        require(msg.sender == owner || msg.sender == projects[_id].recipient, 
                "Only owner or recipient can perform this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    // Update the project creation fee
    function updateProjectCreationFee(uint _fee) public onlyOwner {
        projectCreationFee = _fee;
        emit FeeUpdated(_fee);
    }
    
    function createProject(
        string memory _name,
        string memory _description,
        address payable _recipient // need to pass since owner (platform) can create on behalf of researcher
    ) public payable {
        require(msg.value >= projectCreationFee, "Insufficient fee for project creation");

        // Handle any excess payment
        if (msg.value > projectCreationFee) {
            payable(msg.sender).transfer(msg.value - projectCreationFee);
        }

        // Ensure the recipient address is not the zero address
        require(_recipient != address(0), "Invalid recipient address");

        projectCount++;
    
        projects[projectCount] = Project({
            id: projectCount,
            name: _name,
            description: _description,
            currentFunding: 0,
            recipient: _recipient, // Use passed recipient address
            isActive: true // Starts active
        });

        emit ProjectCreated(projectCount, _name, _recipient, true);
    }

    // Activate a project (only owner can do this)
    function activateProject(uint _id) public onlyOwner {
        require(!projects[_id].isActive, "Project is already active");
        projects[_id].isActive = true;
        emit ProjectActivated(_id);
    }
    
    // Deactivate a project (can be done by owner or recipient)
    function deactivateProject(uint _id) public onlyOwnerOrRecipient(_id) {
        require(projects[_id].isActive, "Project is already inactive");
        projects[_id].isActive = false;
        emit ProjectDeactivated(_id);
    }
    
    // Fund a project (only if the project is active)
    function fundProject(uint _id) public payable projectIsActive(_id) {
        Project storage project = projects[_id];
        require(msg.value > 0, "Donation must be greater than 0");
        project.currentFunding += msg.value;
        
        // Create transaction record
        uint txIndex = transactions.length;
        transactions.push(Transaction({
            projectId: _id,
            amount: msg.value,
            user: msg.sender,
            txType: "fund",
            timestamp: block.timestamp
        }));
        
        // Store transaction index in project's transactions list
        projectTransactions[_id].push(txIndex);
        
        emit Funded(_id, msg.value, msg.sender);
    }
    
    // Withdraw funds from the project (only by onlyOwnerOrRecipient)
    function withdraw(uint _id) public onlyOwnerOrRecipient(_id) projectIsActive(_id) {
        Project storage project = projects[_id];
        require(project.currentFunding > 0, "No funds to withdraw");
        uint amount = project.currentFunding;
        project.currentFunding = 0;
        
        // Transfer funds to recipient
        (bool success, ) = project.recipient.call{value: amount}("");
        require(success, "Transfer failed");
        
        // Create transaction record
        uint txIndex = transactions.length;
        transactions.push(Transaction({
            projectId: _id,
            amount: amount,
            user: project.recipient,
            txType: "withdraw",
            timestamp: block.timestamp
        }));
        
        // Store transaction index in project's transactions list
        projectTransactions[_id].push(txIndex);
        
        emit Withdrawn(_id, amount, project.recipient);
    }
    
    // Get project details (for displaying on the frontend)
    function getProjectDetails(uint _id) public view returns (
        string memory, 
        string memory, 
        uint, 
        address, 
        bool
    ) {
        Project memory project = projects[_id];
        return (
            project.name,
            project.description,
            project.currentFunding,
            project.recipient,
            project.isActive
        );
    }
    
    function getProjectTransactions(uint _id) public view returns (Transaction[] memory) {
        uint[] memory txIndexes = projectTransactions[_id];
        Transaction[] memory result = new Transaction[](txIndexes.length);
        
        for (uint i = 0; i < txIndexes.length; i++) {
            result[i] = transactions[txIndexes[i]];
        }
        
        return result;
    }
    
    // Get the current balance of the contract (fees collected)
    function getContractBalance() public view onlyOwner returns (uint) {
        return address(this).balance;
    }
    
    // Withdraw fees (only owner)
    function withdrawFees() public onlyOwner {
        uint amount = address(this).balance;
        require(amount > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");
    }
}