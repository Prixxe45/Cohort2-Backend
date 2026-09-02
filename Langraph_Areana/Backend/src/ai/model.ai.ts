import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";




export const Nivadia = new ChatOpenRouter({
    model: "nemotron-3.5-lightning:free",
    apiKey: config.OPEN_ROUTER_API_KEY,
    timeout: 120000,
    maxRetries: 2,
});

export const mistralAIModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY,
})


export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY,
})
