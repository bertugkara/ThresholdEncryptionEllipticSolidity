import {useContext, useEffect, useRef, useState} from "react";
import WalletAccountContext from "../../context/WalletAccountContext";
import {isEmpty} from "lodash";
import {getContract} from "../../walletoperations/Contract";
import toastError, {toastSuccess} from "../../utils/Toast";
import TxConclusionTemplate from "../voter/candidateoperations/TxConclusionTemplate";
import {isShareHolder} from "../../api/Checker";
import {ROLE} from "../../utils/ContractParams";


const ShareHolderPanel = () => {

    const {account, role} = useContext(WalletAccountContext);
    const [shareKey, setShareKey] = useState(null);
    const inputRef = useRef(null);
    const [tx, setTx] = useState(null);

    useEffect(() => {
        const inputElement = inputRef.current;
        const handleChange = (event) => {
            setShareKey(event.detail);
        };
        inputElement.addEventListener('bl-change', handleChange);
        return () => {
            inputElement.removeEventListener('bl-change', handleChange);
        };
    }, [inputRef]);

    const handleShareOnClick = async () => {
        const contract = await getContract();
        if(!await isShareHolder(contract, account)) {
            toastError("You are not a shareholder!");
            return;
        }
        console.log(shareKey)
        return await contract.InputPrivateKeyShare(shareKey).then((res) => {
            toastSuccess("Share added successfully!");
            console.log(res);
            setTx(res);
        }).catch((err) => {
            toastError(err.toString());
        });
    }

    return <div style={{marginTop:100}} hidden={role !== ROLE.SHARE_HOLDER}>
        <h1>Share Holder Panel</h1>
        <bl-input ref={inputRef}
                  label="Your Private Key Share">{shareKey}</bl-input>
        <bl-button style={{marginLeft: 30}} kind="success" onClick={handleShareOnClick}>Add Share</bl-button>
        {!isEmpty(tx) && <TxConclusionTemplate txResult={tx}/>}

    </div>
}

export default ShareHolderPanel;