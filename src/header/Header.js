import './Header.css'
import WalletConnect from "../walletoperations/WalletConnect";
import {Ganache_Localhost_Network_Params} from "../utils/ContractParams";

const Header = () => {

    return <div className="navbar">
                <h2 className="logo">Threshold Voting</h2>
            <WalletConnect networkParams={Ganache_Localhost_Network_Params}/>
    </div>
}

export default Header;