import dotenv from 'dotenv';

dotenv.config();


const config = {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
    COHERE_API_KEY: process.env.COHERE_API_KEY || '',
    OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY || ''
}


export default config;