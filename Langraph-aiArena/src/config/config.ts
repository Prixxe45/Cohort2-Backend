import {config} from "dotenv";
config();

type CONFIG = {
readonly  OPEN_ROUTER_API_KEY: string;
}

const confi: CONFIG = {
  OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY ||""
}

export default confi;