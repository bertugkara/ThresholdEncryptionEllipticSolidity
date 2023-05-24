export const E_VOTING_CONTRACT_ADDRESS = "0x0b17A4807564066fb64e669E966dc72a448AE5Fb"; //localhost Ganache Created Contract Address
export const Ganache_Localhost_Network_Params = {
    chainId: `0x539`, //1337
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: ['http://localhost:7545'],
    chainName: 'STORMY-DUCKS (Ganache)',
}
export const ROLE = {
    CONTRACT_OWNER: "CONTRACT_OWNER",
    VOTER: "VOTER",
    SHARE_HOLDER: "SHARE_HOLDER",
}