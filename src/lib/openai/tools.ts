import { Alchemy } from 'alchemy-sdk';
import { ChainName, QuoteResponse, TokenName } from '../types/tools';
import { CHAIN_IDS, TOKEN_ADDRESSES } from '../constants';
import { error } from 'console';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY as string;

if (!ALCHEMY_API_KEY) {
  throw new Error(
    'Missing Alchemy API Key. Please set ALCHEMY_API_KEY in your .env file.'
  );
}

interface FetchTokenBalanceArgs {
  address: string;
  token?: string;
}

export async function fetchTokenBalance({
  address,
}: // token,
FetchTokenBalanceArgs): Promise<string> {
  const config = {
    apiKey: ALCHEMY_API_KEY,
    url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    connectionInfoOverrides: {
      skipFetchSetup: true,
    },
  };
  console.log('Config:::', config);

  const alchemy = new Alchemy(config);
  console.log('Alchemy:::', alchemy);
  console.log('Fetching balance for address 30 - tools:', address);

  try {
    // let balance;
    // if (token && token !== 'ethereum') {
    //   balance = await alchemy.core.getTokenBalances(address, [token]);
    //   const tokenBalance = balance.tokenBalances[0].tokenBalance ?? '0';
    //   console.log(
    //     'Token Balance:',
    //     parseFloat(tokenBalance) / Math.pow(10, 18)
    //   );
    // } else {
    const balance = await alchemy.core.getBalance(address);
    console.log('ETH Balance:', parseFloat(balance.toString()) / 1e18, 'ETH');
    const parsed_balance = parseFloat(balance.toString()) / 1e18;
    return parsed_balance.toString();
    // }
  } catch (error) {
    console.error('Error:', error);
    return (-1).toString();
  }
}

export async function fetchSwapQuotes(
  fromToken: string,
  toToken: string,
  fromChain: string,
  toChain: string,
  amount: string,
  userAddress: string
) {
  // const quotes: QuoteResponse[] = [];

  // Configuration
  const LIFI_API_URL = 'https://li.fi/v1';
  const SOCKET_API_URL = 'https://api.socket.tech/v2';
  const SOCKET_API_KEY = process.env.SOCKET_API_KEY!;

  console.log(
    'Fetching quotes for swap:',
    fromToken,
    toToken,
    fromChain,
    toChain,
    amount,
    userAddress
  );
  console.log('Socket API Key:', SOCKET_API_KEY);

  const fromChainName = fromChain.toUpperCase() as ChainName;
  const toChainName = toChain.toUpperCase() as ChainName;

  console.log('From Chain:', fromChainName);
  console.log('To Chain:', toChainName);

  console.log(`CHAIN_IDS[fromChainName]: ${CHAIN_IDS[fromChainName]}`);
  console.log(`CHAIN_IDS[toChainName]: ${CHAIN_IDS[toChainName]}`);

  console.log(
    'TOKEN_ADDRESSES[fromToken]:',
    TOKEN_ADDRESSES[fromToken.toUpperCase()]
  );
  console.log(
    'TOKEN_ADDRESSES[toToken]:',
    TOKEN_ADDRESSES[toToken.toUpperCase()]
  );

  const fromTokenAddress =
    TOKEN_ADDRESSES[fromToken.toUpperCase()][CHAIN_IDS[fromChainName]] ??
    TOKEN_ADDRESSES[fromToken.toUpperCase()][CHAIN_IDS.ETHEREUM];
  const toTokenAddress =
    TOKEN_ADDRESSES[toToken.toUpperCase()][CHAIN_IDS[toChainName]] ??
    TOKEN_ADDRESSES[toToken.toUpperCase()][CHAIN_IDS.ETHEREUM];

  if (!fromTokenAddress || !toTokenAddress) {
    throw new Error(
      `Invalid token/chain combination: ${fromToken} on ${fromChain} to ${toToken} on ${toChain}`
    );
  }

  let quotes;
  // Convert amount to number using token decimals
  const fromTokenDecimals = TOKEN_ADDRESSES[fromToken.toUpperCase()].decimals || 18;
  const amountInWei = BigInt(amount) * BigInt(10) ** BigInt(fromTokenDecimals);
  const amountAsString = amountInWei.toString();

  try {
    // Fetch Socket quote
    const socketQuote = await getSocketQuote({
      fromChainId: CHAIN_IDS[fromChainName].toString(),
      fromTokenAddress: fromTokenAddress as string,
      toChainId: CHAIN_IDS[toChainName].toString(),
      toTokenAddress: toTokenAddress as string,
      fromAmount: amountAsString,
      userAddress: userAddress,
      singleTxOnly: false,
    });
    // console.log('Socket Quote:', socketQuote);

    console.log('Socket Quote: 127', socketQuote);

    if (socketQuote.success) {
      // const socketData = await socketQuote;
      quotes = { data: socketQuote.result, provider: 'Socket', error: '' };
      console.log('Inside success Socket Quote 132:', quotes);
    } else {
      quotes = {
        provider: 'Socket',
        error: 'Failed to fetch quote',
        data: {},
      };
    }
    // console.log('Socket Quote:', quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
  }
  console.log('ALL Quote 143 in tools:', quotes);
  return quotes;
}

// Response type for the quote endpoint
interface SocketQuoteResponse {
  success: boolean;
  result: {
    routes: Array<{
      routeId: string;
      usedDex: Array<string>;
      fromChainId: number;
      toChainId: number;
      fromToken: TokenInfo;
      toToken: TokenInfo;
      fromAmount: string;
      toAmount: string;
      estimatedGas: string;
      // Add other properties as needed
    }>;
  };
}

interface TokenInfo {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

// Parameters interface with optional parameters marked
interface QuoteParams {
  fromChainId: string; // Required: Source chain ID
  fromTokenAddress: string; // Required: Source token address
  toChainId: string; // Required: Destination chain ID
  toTokenAddress: string; // Required: Destination token address
  fromAmount: string; // Required: Amount to swap (in base units)
  userAddress: string; // Required: User's wallet address
  uniqueRoutesPerBridge?: boolean; // Optional: Default is false
  sort?: 'output' | 'gas' | 'time'; // Optional: Default is 'output'
  singleTxOnly?: boolean; // Optional: Default is false
}

async function getSocketQuote({
  fromChainId,
  fromTokenAddress,
  toChainId,
  toTokenAddress,
  fromAmount,
  userAddress,
  uniqueRoutesPerBridge = false,
  sort = 'output',
  singleTxOnly = false,
}: QuoteParams): Promise<SocketQuoteResponse> {
  const API_KEY = process.env.SOCKET_API_KEY;

  if (!API_KEY) {
    throw new Error('Socket API key is not configured');
  }

  const queryParams = new URLSearchParams({
    fromChainId: fromChainId,
    fromTokenAddress,
    toChainId: toChainId,
    toTokenAddress,
    fromAmount,
    userAddress,
    uniqueRoutesPerBridge: uniqueRoutesPerBridge.toString(),
    sort,
    singleTxOnly: singleTxOnly.toString(),
  });
  console.log('Query Params:', queryParams.toString());

  const response = await fetch(
    `https://api.socket.tech/v2/quote?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'API-KEY': API_KEY,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  console.log('Socket Quote Response 235', json);
  return json as SocketQuoteResponse;
}

// async function getLifiQuote() {
//       // Fetch Lifi quote
//       const lifiQuote = await fetch(`${LIFI_API_URL}/quote`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           fromChain: CHAIN_IDS[fromChainName],
//           toChain: CHAIN_IDS[toChainName],
//           fromToken: fromTokenAddress,
//           toToken: toTokenAddress,
//           fromAmount: amount,
//           fromAddress: userAddress,
//           slippage: 1, // 1% slippage
//         }),
//       });

//       if (lifiQuote.ok) {
//         const lifiData = await lifiQuote.json();
//         quotes.push({
//           provider: 'Lifi',
//           estimatedGas: lifiData.estimate.gasCosts?.[0]?.amount || '0',
//           outputAmount: lifiData.estimate.toAmount,
//           route: lifiData.estimate.route,
//         });
//       } else {
//         quotes.push({
//           provider: 'Lifi',
//           estimatedGas: '0',
//           outputAmount: '0',
//           error: 'Failed to fetch quote',
//         });
//       }
//       console.log('Lifi Quote:', lifiQuote);
//       console.log('/ALL Quote 111:', quotes);

// }
