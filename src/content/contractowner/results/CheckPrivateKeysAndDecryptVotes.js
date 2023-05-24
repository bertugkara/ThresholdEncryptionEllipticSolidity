import {getContract} from "../../../walletoperations/Contract";
import toastError from "../../../utils/Toast";
import {CandidateList} from "../../voter/candidateoperations/CandidateList";

const threshold = require('shamirs-secret-sharing')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const ecies = require('eciesjs')

const contract = await getContract();
export const checkPrivateKeysAndDecryptVotes = async (allEncryptedVotes, submittedPrivateKeyShares) => {
    submittedPrivateKeyShares.map((share) => Buffer.from(share, 'hex'));
    const recoveredPrivateKey = threshold.combine(submittedPrivateKeyShares.slice(0, 3));
    console.log(recoveredPrivateKey.toString('hex'))

    let publicKey = await contract.publicKey();
    let publicKeyObtainedFromPrivateKey = ec.keyFromPrivate(recoveredPrivateKey).getPublic().encode('hex');

    let isMatch = checkPrivateKeyAndPublicKeyMatches(publicKeyObtainedFromPrivateKey, publicKey);
    if (!isMatch) {
        toastError("Private key and public key do not match");
        return;
    }

    let encryptedVotesBufferArray = allEncryptedVotes.map((encryptedVote) => {
        if (encryptedVote[0] === false || encryptedVote[1] === "") return;
        return Buffer.from(encryptedVote[1], 'hex');
    });

    let decryptedVotes = encryptedVotesBufferArray.map((encryptedVote) => {
        if (encryptedVote === undefined) return;
        return ecies.decrypt(recoveredPrivateKey, encryptedVote).toString();
    });

    let resultTemplate = CandidateList.map((candidate) => {
            return {id: candidate.id, voteCount: 0, name: candidate.name};
    });

    resultTemplate.forEach((candidate, index) => {
        decryptedVotes.forEach((decryptedVote) => {
            if (decryptedVote == resultTemplate[index].id.toString()) {
                resultTemplate[index].voteCount++;
            }
        });
    });

    return resultTemplate;
}

const checkPrivateKeyAndPublicKeyMatches = (publicKeyObtainedFromPrivateKey, publicKey) => {
    return publicKeyObtainedFromPrivateKey.toString() === publicKey.toString();
}