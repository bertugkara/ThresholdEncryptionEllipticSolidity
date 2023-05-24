import {isEmpty, set} from "lodash";
import toastError, {toastInfo} from "../utils/Toast";
import {getContract} from "../walletoperations/Contract";
import bigInt from "big-integer";

const contract = await getContract();

export const checkIsVotingLive = async () => {
    return await contract.isVotingLive().then((res) => {
        return res;
    }).catch(() => {
        toastError("Failed to check if voting is live.");
    });
}

export const calculateResults = async () => {
    toastInfo("Calculating results...")
    return await contract.calculateResults().then((res) => {
        if (isEmpty(res)) return [];
        return res.map((item, index) => {
            let editedItem = {};
            set(editedItem, "id", index);
            set(editedItem, "candidateName", res[index][0]);
            set(editedItem, "voteCount", res[index][1].toString());
            return editedItem;
        });
    }).catch((err) => {
        toastError("Failed to calculate results." + err.toString());
    });
}

export const enableVoting = async () => {
    toastInfo("Enabling voting...")
    return await contract.openCloseVoting().then((res) => { //Todo lagging
        return res;
    }).catch((err) => {
        toastError("Failed to enable voting." + err.toString());
    });
}

export const getIsReadyForCounting = async () => {
    return await contract.isReadyForCounting().then((res) => {
        return res;
    }).catch((err) => {
        toastError("Failed to get is ready for counting." + err.toString());
    });
}

export const getAllEncryptedVotes = async () => {
    return await contract.getAllEncryptedVotes().then((res) => {
        return res;
    }).catch((err) => {
        toastError("Failed to get all encrypted votes." + err.toString());
    });
}

export const getShareInputCount = async () => {
    let shareInputAndThresholdInformation = {};

    await contract.shareInputCount().then((res) => {
        set(shareInputAndThresholdInformation, "shareInputCount", res.toString());
    }).catch((err) => {
        toastError("Failed to get share input count." + err.toString());
    });

    await contract.threshold().then((res) => {
        set(shareInputAndThresholdInformation, "threshold", res.toString());
    });
    return shareInputAndThresholdInformation;
}

export const enableCounting = async () => {
    toastInfo("Enabling counting...")
    return await contract.assignContractAsReady().then((res) => {
        return res;
    }).catch((err) => {
        toastError("Failed to enable counting." + err.toString());
    });
}

export const checkOfflineThreeKeysReachedEvents = async () => {
    const filter = await contract.filters.threeKeysReached();
    const events = await contract.queryFilter(filter);
    if (!isEmpty(events)) {
        return await Promise.all(events.map(async (event, index) => {
            if(event.args[0] >= bigInt(3)){
                return event;
            }
        }));
    } else {
        return [];
    }
}

export const getSubmittedPrivateKeyShares = async () => {
    return await contract.getShareKeysIfThresholdReached().then((res) => {
        return res;
    }).catch((err) => {
        toastError("Failed to get submitted private key shares." + err.toString());
    });
}