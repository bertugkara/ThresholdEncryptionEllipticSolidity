import {Fragment, useContext, useEffect, useRef, useState} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import toastError, {toastWarning} from "../utils/Toast";
import WalletAccountContext from "../context/WalletAccountContext";
import {debounce, isEmpty, toLower} from "lodash";
import {Icon} from '@iconify/react';
import {verifyMessage} from "ethers";

const WalletConnect = (props) => {

    const {account, setAccount} = useContext(WalletAccountContext);
    const [signedAddress, setSignedAddress] = useState(null);
    window.ethereum.on('chainChanged', handleChainChanged);
    const debouncedHandleAccountsChanged = debounce(handleAccountsChanged, 1000);
    window.ethereum.on('accountsChanged', debouncedHandleAccountsChanged);

    useEffect(() => {
        checkMetamask();
    }, []);

    async function checkMetamask() {
        const provider = await detectEthereumProvider();
        if (!provider) alert('Please install Metamask');
        else if (provider !== window.ethereum) {
            alert('Do you have multiple wallets installed? One of them perhaps trying to block Metamask, please disable it and try again');
        }
        if (provider.chainId !== props.networkParams.chainId) {
            handleSwitchNetwork();
        }
    }

    const handleSwitchNetwork = async () => {
        const provider = await detectEthereumProvider();
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: props.networkParams.chainId}]
        }).catch((err) => {
            if (err.code === 4902) {
                handleAddNetwork()
            } else if (err.code === -32002) {
                toastError('Please Confirm or Cancel the previous Switch Chain request.');
            } else if (err.code === -32603) {
                handleAddNetwork();
            }
        });
    }

    const handleAddNetwork = async () => {
        const provider = await detectEthereumProvider();
        provider.request({
            method: 'wallet_addEthereumChain',
            params: [props.networkParams]
        }).catch((err) => {
            toastError(err);
        });
    }

    function handleChainChanged(chainId) {
        handleSwitchNetwork();
        window.location.reload();
    }

    const isSigningRef = useRef(false);
    async function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            alert('Please connect to MetaMask.');
        } else if (accounts[0] !== account && !isSigningRef.current) {
            isSigningRef.current = true;
            await handleConnectWallet().catch((err) => {
                toastError(err);
            });
            isSigningRef.current = false;
        }
    }

    const handleConnectWallet = async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
            .catch((err) => {
                if (err.code === 4001) {
                    toastWarning('Please connect to MetaMask.');
                } else {
                    toastError(err);
                }
            });
        const message = "Sign this message to verify your identity, this will not cost you any gas nor any tokens";
        const encoder = new TextEncoder();
        const messageBytes = encoder.encode(message);
        const hexMessage = `0x${Array.prototype.map.call(messageBytes, x => x.toString(16).padStart(2, '0')).join('')}`;
        await window.ethereum.request({
            method: 'personal_sign',
            params: [hexMessage, accounts[0]],
        }).then((signature) => {
            const recoveredAddress = verifyMessage(message, signature);
            if (toLower(recoveredAddress) === toLower(accounts[0])) {
                setAccount(accounts[0]);
                setSignedAddress(recoveredAddress);
            }
        }).catch((error) => {
            toastError(error.message.toString());
            setAccount(null);
        });
    }

    const handleLogout = () => {
        setAccount(null);
        setSignedAddress(null);
    }

    return <Fragment> {isEmpty(account) ? <bl-button label onClick={handleConnectWallet}>
        Connect Metamask
    </bl-button> : <div>
        <Icon icon="logos:metamask-icon" style={{marginRight: 10}}/>
        Account:
        <br/>
        <span style={{marginLeft: 10, marginRight: 10}}>{account}</span>
        <bl-icon onClick={handleLogout} name="exit" title="exit"></bl-icon>
    </div>
    }

    </Fragment>
}

export default WalletConnect;