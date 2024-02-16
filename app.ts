import {Pinecone} from "@pinecone-database/pinecone";
import {OpenAI} from "openai"
import 'dotenv/config'

const pinecone = new Pinecone( {
    apiKey:  String(process.env.PINECONE_API_KEY)
});
const openai = new OpenAI({
    apiKey: String(process.env.OPENAPI_API_KEY)
})

export {pinecone, openai}