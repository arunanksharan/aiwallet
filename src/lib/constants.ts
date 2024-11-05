export const CHAIN_IDS = {
    ETHEREUM: '1',
    POLYGON: '137',
    // Add more chains as needed
} as const;


export const TOKEN_ADDRESSES: Record<string, { [key: string]: string | number }> = {
    // Ethereum Mainnet
    ETHEREUM: {
        [CHAIN_IDS.ETHEREUM]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Native ETH
        symbol: 'ETH',
        decimals: 18
    },
    USDC: {
        [CHAIN_IDS.ETHEREUM]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
        [CHAIN_IDS.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
        symbol: 'USDC',
        decimals: 6
    },
    ETH: {
        [CHAIN_IDS.ETHEREUM]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Native ETH
        symbol: 'ETH',
        decimals: 18
    },
    // Add more tokens as needed
} as const;
console.log('CHAIN_IDS:', CHAIN_IDS);
console.log('TOKEN_ADDRESSES:', TOKEN_ADDRESSES);