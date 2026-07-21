import dotenv from "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai";
import { sendEmail } from "./mail.service.js";
import { HumanMessage, tool, createAgent } from "langchain";
import { tavily } from "@tavily/core";
import readline from "readline/promises";
import * as z from "zod";

const emailTool = tool(sendEmail, {
  name: "emailTool",
  description: "Use this tool Send an Email",
  schema: z.object({
    to: z.string().describe("The email address of the recipient"),
    subject: z.string().describe("The subject of the email"),
    html: z.string().describe("The HTML content of the email"),
    text: z.string().optional().describe("The plain text content of the email"),
  }),
});

const tvly = tavily({
  apiKey: process.env.tvly_Api_Key,
});

const tavilyTool = tool(
  async ({query}) => {
    const response = await tvly.search(query, {
      searchDepth: "advanced",
      maxResults: 5,
    });
    return JSON.stringify(response.results);
  },
  {
    name: "tavilyTool",
    description: "Use this tool to search the web using Tavily",
    schema: z.object({
      query: z.string().describe("The search query to be sent to Tavily"),
    }),
  }
)






const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});



const model = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
});

const agent = createAgent({
  model,
  tools: [ tavilyTool, emailTool],
})

const messages = []

while (true) {
  const userInput = await rl.question("\x1b[32mYou:\x1b[0m ");

  messages.push(new HumanMessage(userInput));

  const response = await agent.invoke({
    messages,
  });

  messages.push(response.messages[response.messages.length - 1]);

  console.log(
    `\x1b[34m[AI]\x1b[0m ${response.messages[response.messages.length - 1].content}`,
  );
}


