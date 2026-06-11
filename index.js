import  "dotenv/config";


import promptSync from "prompt-sync";

const prompt = promptSync();

import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
});



while (true) {
const name = prompt("You: ");

const resp = await model.invoke(name);
console.log("Ai: " + resp.text);
}


