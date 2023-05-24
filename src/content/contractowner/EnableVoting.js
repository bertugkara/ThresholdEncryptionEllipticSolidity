import {useContext, useEffect, useState} from "react";
import WalletAccountContext from "../../context/WalletAccountContext";
import {isEmpty} from "lodash";
import {toastSuccess} from "../../utils/Toast";
import {
    checkIsVotingLive,
    checkOfflineThreeKeysReachedEvents,
    enableVoting
} from "../../api/VotingOperationsApi";

const EnableVoting = (props) => {

    const {account} = useContext(WalletAccountContext);
    const [threeKeysReachedEvents, setThreeKeysReachedEvents] = useState([]);

    useEffect(() => {
        if (!isEmpty(account)) {
            checkOfflineThreeKeysReachedEvents().then((res) => {
                console.log(res)
                setThreeKeysReachedEvents(res);
            });
            handleCheckIsVotingLive().catch((err) => {
                console.log(err);
            });
        }
    }, [account]);

    const handleCheckIsVotingLive = async () => {
        await checkIsVotingLive().then((res) => {
            props.setIsVotingLive(res);
        });
    }

    const handleEnableVotingOnClick = async () => {
        await enableVoting().then((res) => {
            if (!isEmpty(res)) {
                toastSuccess("Voting is enabled successfully! Please Refresh the page.");
                setTimeout(() => {
                    handleCheckIsVotingLive();
                }, 3000);
            }
        });
    }

    const isThreeKeysReached = () => {
        return threeKeysReachedEvents[0].args[0] >= 3;
    }

    const EnableVotingViewTemplate = () => {
        if (props.isShareInputGreaterOrEqualsThanThreshold() && isThreeKeysReached() && props.isReadyForCounting) {
            return <div>Voting is Offline, Counting Votes...</div>
        } else if (props.isVotingLive) {
            return <div>Voting is live</div>
        } else {
            return <div> Voting is not live yet. Click Here to enable. <bl-button
                onClick={handleEnableVotingOnClick}>Enable
                Voting</bl-button></div>
        }
    }

    return <div hidden={props.isVotingLive} style={{marginBottom: 20}}>
        {EnableVotingViewTemplate()}
    </div>
}

export default EnableVoting;