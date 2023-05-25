// SPDX-License-Identifier: MIT
// here is code for perform threshold encryption on solidity.
// I do obtain keypairs on javascript, then send the key pairs to the share holders.
// We are performing the decryption and Schamir's Secret Sharing combining on frontend side.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ThresholdVoting is Ownable {

    struct Voter {
        bool isVoted;
        string encryptedVote;
    }

    mapping(address => Voter) public voterList;
    address[] public votedAddresses; // for calculating results

    string[] public candidateCodeList = ["FB", "GS"];

    bool public isVotingLive;
    bool public isReadyForCounting;
    uint256 public voteCount;
    string public publicKey = "048389853cbec3f0360ddfc9c95f0aea87eb433bb528db0d090fceddaa2d6e35a83da21ef4d1a0dbe0d31072c54f7251f4c999f53586213272882363a0b335b087";

    uint8 public threshold = 3;
    uint8 public shareCount = 5;
    uint256 public shareInputCount;
    mapping(address => string) public shareHolderCarriers;
    address[] public shareHolderEligibleAddresses;
    address[] public shareSubmittedAddresses;

    constructor(address[] memory eligibleShareHolderList) {
        require(eligibleShareHolderList.length <= 5, "Share holder list cant be any longer than 5");
        voteCount = 0;
        shareInputCount = 0;
        isReadyForCounting = false;
        isVotingLive = false;
        for (uint8 i = 0; i < eligibleShareHolderList.length; i++) {
            eligibleShareHolderList[i] == msg.sender ? revert() : shareHolderEligibleAddresses.push(eligibleShareHolderList[i]);
        }
    }

    modifier isVotingProcessLive() {
        require(isVotingLive == true, "Voting is not live");
        _;
    }

    function openCloseVoting() external onlyOwner {
        require(!isReadyForCounting, "You can not start voting again, votes are already calculating...");
        isVotingLive = !isVotingLive;
    }

    function Vote(string memory _encryptedVote) public isVotingProcessLive {
        require(voterList[msg.sender].isVoted == false, "You are already voted!");
        voterList[msg.sender].isVoted = true;
        voterList[msg.sender].encryptedVote = _encryptedVote;
        voteCount++;
        votedAddresses.push(msg.sender);
    }

    function getAllEncryptedVotes() public view returns (Voter[] memory) {
        require(isReadyForCounting, "Contract is not ready enough for calculating.");
        Voter[] memory voters = new Voter[](votedAddresses.length);
        for (uint256 i = 0; i < votedAddresses.length; i++) {
            address voterAddress = votedAddresses[i];
            voters[i] = voterList[voterAddress];
        }
        return voters; // return all encrypted votes for off-chain Schamir's secret sharing combining and decrypting using ECIES. 
    }

    function isExistsOnShareHolderEligibleAddressList(address messageSender) public view returns (bool) {
        for (uint8 i = 0; i < shareHolderEligibleAddresses.length; i++) {
            if (shareHolderEligibleAddresses[i] == messageSender) return true;
        }
        return false;
    }

    event threeKeysReached(uint8 reachedKeyCounter);

    function InputPrivateKeyShare(string memory _privateKeyShare) public isVotingProcessLive
    {
        // you can add more logic here, for example we do not want to enter any private key before 100 votes, or before 5PM.
        //For now whenever contract reaches 3 keys, it stops voting process. 
        // We are performing the decryption and Schamir's Secret Sharing combining on frontend side.
        require(isExistsOnShareHolderEligibleAddressList(msg.sender), "You are not allowed to add private key share.");
        require(bytes(shareHolderCarriers[msg.sender]).length == 0, "You already submitted your privateKey.");
        shareHolderCarriers[msg.sender] = _privateKeyShare;
        shareSubmittedAddresses.push(msg.sender);
        shareInputCount++;
        if (shareInputCount >= threshold) {
            isVotingLive = false; // threshold reached stop voting!
            emit threeKeysReached(uint8(shareInputCount));
            isReadyForCounting = true;
        }
    }

    function getShareKeysIfThresholdReached() public view returns (string[] memory){
        require(isReadyForCounting, "Voting is onging.");
        string[] memory allTheInputedKeys = new string[](shareInputCount);
        address[] memory shareSubmittedAddressList = getAllShareHolders();
        for (uint256 i = 0; i < shareInputCount; i++) {
            allTheInputedKeys[i] = shareHolderCarriers[shareSubmittedAddressList[i]];
        }
        return allTheInputedKeys;
    }

    function getAllShareHolders() internal view returns (address[] memory) {
        address[] memory allShareHolders = new address[](shareSubmittedAddresses.length);
        for (uint256 i = 0; i < shareSubmittedAddresses.length; i++) {
            allShareHolders[i] = shareSubmittedAddresses[i];
        }
        return allShareHolders;
    }

    receive() external payable {
        revert("No direct Payments!");
    }

    fallback() external payable {
        revert("No direct Payments!");
    }
}
