import { CHAIN_IDS, TOKEN_ADDRESSES } from "../constants";

export type QuoteResponse = {
    provider: string;
    estimatedGas: string;
    outputAmount: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    route?: any;
    error?: string;
};

// Create types from constants
export type ChainID = typeof CHAIN_IDS[keyof typeof CHAIN_IDS];
export type ChainName = keyof typeof CHAIN_IDS;
export type TokenName = keyof typeof TOKEN_ADDRESSES;

export const TOKENS = {
    ETH: 'ETH',
    USDC: 'USDC',
} as const;

export type TokenSymbol = keyof typeof TOKENS;

export type TokenAddressMap = {
    [chain in ChainID]?: string;
}

export type TokenConfig = TokenAddressMap & {
    symbol: string;
    decimals: number;
}

console.log('CHAIN_IDS:', CHAIN_IDS);
console.log('TOKENS:', TOKENS);

