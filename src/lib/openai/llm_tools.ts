import { ChatCompletionTool } from "openai/resources/index.mjs"; // Adjust based on the actual OpenAI package path

export const llm_tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "fetch_token_balance",
      description: "Fetch balance of a given token available in a cryptocurrency wallet. For example, when a customer asks 'what is the balance of a token available in my wallet'",
      strict: true,
      parameters: {
        type: "object",
        properties: {
          address: {
            type: "string",
            description: "Wallet address for which to fetch the token balance",
          },
          token: {
            type: "string",
            description: "Name of the token for which to fetch the balance",
          },
        },
        required: ["address", "token"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fetch_swap_quotes",
      description: "Fetch quotation for swapping a given token available in a cryptocurrency wallet with another token provided by the user. For example, when a customer asks 'I want to swap token X with token Y'",
      strict: true,
      parameters: {
        type: "object",
        properties: {
          fromToken: {
            type: "string",
            description: "Token to swap from",
          },
          toToken: {
            type: "string",
            description: "Token to swap to",
          },
          fromChain: {
            type: "string",
            description: "Chain to swap from",
          },
          toChain: {
            type: "string",
            description: "Chain to swap to",
          },
          amount: {
            type: "number",
            description: "Amount of token to swap",
          },
          userAddress: {
            type: "string",
            description: "User's wallet address",
          },
        },
        required: ["fromToken", "toToken", "fromChain", "toChain", "amount", "userAddress"],
        additionalProperties: false,
      },
    },
  },
];