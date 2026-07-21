import { ChatOpenAI } from "@langchain/openai";
import confi from "../config/config.js"

export const modelNvidia = new ChatOpenAI({
  model: "nvidia/nemotron-3-ultra-550b-a55b:free",
  apiKey: confi.OPEN_ROUTER_API_KEY,
   configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

export const modelGoogle = new ChatOpenAI({
  model: "google/gemma-4-26b-a4b-it:free",
  apiKey: confi.OPEN_ROUTER_API_KEY,
   configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

export const modelOpenAi = new ChatOpenAI({
  model: "openai/gpt-oss-20b:free",
  apiKey: confi.OPEN_ROUTER_API_KEY,
   configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
