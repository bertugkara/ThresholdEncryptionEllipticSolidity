import {useContext, useEffect, useState} from "react";
import CandidateViewTemplate from "./CandidateViewTemplate";
import {isEmpty} from "lodash";
import TxConclusionTemplate from "./TxConclusionTemplate";
import {ROLE} from "../../../utils/ContractParams";
import {isOwnerOfTheContract} from "../../../api/Checker";
import toastError, {toastSuccess} from "../../../utils/Toast";
import {getContract} from "../../../walletoperations/Contract";
import WalletAccountContext from "../../../context/WalletAccountContext";
import {encryptAndSendVote} from "./voteoperations/VotingOperations";
import {CandidateList} from "./CandidateList";

const VoterPanel = () => {

    const {account, role} = useContext(WalletAccountContext);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [tx, setTx] = useState(null);

    useEffect(() => {
        setTx(null);
        setSelectedCandidate(null);
    }, [account]);

    const loginToSeeTheCandidatesTemplate = <h2>Please login your Metamask to see the candidates</h2>;

    const question = "Who will win the league?";

    const handleVoteClicked = async () => {
        const contract = await getContract();
        if (await isOwnerOfTheContract(contract, account)) {
            toastError("You are owner of the contract, you can not request for Voting!");
            return;
        }
        await encryptAndSendVote(selectedCandidate).then((res) => {
                setTx(res);
                console.log(res);
                toastSuccess("Successfully voted")
            });
    }

    return <div style={{marginTop: 80}} hidden={role !== ROLE.VOTER}>
        {isEmpty(account) ? loginToSeeTheCandidatesTemplate : <div>
            <h1>{question}</h1>
            <h2 style={{marginTop: 40}}> Candidates < /h2>
            <br/>
            <CandidateViewTemplate selectedCandidate={selectedCandidate} candidateList={CandidateList}
                                   setSelectedCandidate={setSelectedCandidate}/>
            {!isEmpty(selectedCandidate) &&
                <bl-button id="Send-Vote-Button" style={{marginTop: 30}} kind="success"
                           onClick={handleVoteClicked}>Vote</bl-button>
            }
            {!isEmpty(tx) && <TxConclusionTemplate txResult={tx}/>}

        </div>
        }
    </div>
}

export default VoterPanel;
