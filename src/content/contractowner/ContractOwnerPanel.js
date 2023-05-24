import {useContext, useEffect, useState} from "react";
import WalletAccountContext from "../../context/WalletAccountContext";
import EnableVoting from "./EnableVoting";
import CalculateResults from "./results/CalculateResults";
import {
    getIsReadyForCounting,
    getShareInputCount
} from "../../api/VotingOperationsApi";
import { Icon } from '@iconify/react';

import {isEmpty} from "lodash";

const ContractOwnerPanel = () => {

    const {account} = useContext(WalletAccountContext);
    const [isVotingLive, setIsVotingLive] = useState(false);
    const [shareInputAndThresholdInformation, setShareInputAndThresholdInformation] = useState(null);
    const [isReadyForCounting, setIsReadyForCounting] = useState(false);

    useEffect(() => {
        if (!isEmpty(account)) {
            getShareInputCount().then((res) => {
                console.log(res);
                setShareInputAndThresholdInformation(res);
            });

            getIsReadyForCounting().then((res) => {
                console.log(res);
                setIsReadyForCounting(res);
            });
        }
    }, [account]);

    const isShareInputGreaterOrEqualsThanThreshold = () => {
        return shareInputAndThresholdInformation?.shareInputCount >= shareInputAndThresholdInformation?.threshold;
    }

    const isCalculateResultsButtonVisible = () => {
        return isShareInputGreaterOrEqualsThanThreshold() && !isVotingLive && isReadyForCounting;
    }

    return <div style={{marginTop: 100}}>
        <h1>Contract Owner Panel</h1>
        <h4 style={{color:"red"}}>Please wait for Voting process to end or Private Key shares to be entered. <Icon icon="material-symbols:warning-outline" /></h4>
        <EnableVoting isVotingLive={isVotingLive}
                      isShareInputGreaterOrEqualsThanThreshold={isShareInputGreaterOrEqualsThanThreshold}
                      setIsVotingLive={setIsVotingLive} isReadyForCounting={isReadyForCounting}/>
        <div className="chromatic-wrapper" style={{marginTop: 20}} hidden={!isCalculateResultsButtonVisible()}>
            <CalculateResults/>
        </div>
    </div>
}

export default ContractOwnerPanel;