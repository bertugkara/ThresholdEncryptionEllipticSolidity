import {getContract} from "../../../../walletoperations/Contract";

const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const ecies = require('eciesjs')

const contract = await getContract();
export const encryptAndSendVote = async (selectedCandidate) => {

    let publicKeyAsString = await contract.publicKey();
    const message = Buffer.from(selectedCandidate.id.toString());
    let keyPair = ec.keyFromPublic(publicKeyAsString, 'hex');
    const publicKeyArray = keyPair.getPublic().encode();
    const publicKeyBuffer = Buffer.from(publicKeyArray);
    const encryptedVote = ecies.encrypt(publicKeyBuffer, message);

    return await contract.Vote(encryptedVote.toString('hex'));
}