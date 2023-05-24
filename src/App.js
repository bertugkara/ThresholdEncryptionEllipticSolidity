import './App.css';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect, useState} from "react";
import WalletAccountContext from "./context/WalletAccountContext";
import Header from "./header/Header";
import {isEmpty} from "lodash";
import {isOwnerOfTheContract, isShareHolder} from "./api/Checker";
import {ROLE} from "./utils/ContractParams";
import {getContract} from "./walletoperations/Contract";
import VoterPanel from "./content/voter/candidateoperations/Candidate";
import ContractOwnerPanel from "./content/contractowner/ContractOwnerPanel";
import ShareHolderPanel from "./content/shareholder/ShareHolderPanel";

function App() {

    const [account, setAccount] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        checkAndAssignRole();
    }, [account]);

    useEffect(() => {
        console.log("Role assigned:", role);
    }, [role]);

    const checkAndAssignRole = async () => {
        const contract = await getContract();
        if (!isEmpty(account)) {
            const isOwner = await isOwnerOfTheContract(contract, account);
            setRole(isOwner ? ROLE.CONTRACT_OWNER : null);

            if (!isOwner) {
                await ifRoleIsNotAssigned(contract,account);
            }
        }
    }

    const ifRoleIsNotAssigned = async (contract, account) => {
        const isShareHolderResult = await isShareHolder(contract, account);
        setRole(isShareHolderResult ? ROLE.SHARE_HOLDER : ROLE.VOTER);
    }

    return (
        <div className="App">
            <ToastContainer/>
            <WalletAccountContext.Provider value={{account, setAccount, role, setRole}}>
                <Header/>
                {role === ROLE.CONTRACT_OWNER && <ContractOwnerPanel/>}
                {role === ROLE.SHARE_HOLDER && <ShareHolderPanel/>}
                {role === ROLE.VOTER && <VoterPanel/>}
            </WalletAccountContext.Provider>
        </div>
    );
}

export default App;
