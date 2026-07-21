import express from "express";
import { modelGoogle, modelNvidia } from "./services/models.service.js";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


const response2 = await modelGoogle.invoke("Why do parrots talk?");
console.log("res2:" + response2.content)
const response1 = await modelNvidia.invoke("Why do parrots talk?");
console.log("res1:" + response1.content)



export default app;