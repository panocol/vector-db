import {Pinecone} from "@pinecone-database/pinecone";
import {OpenAI} from "openai"
import 'dotenv/config'
import {QdrantClient} from "@qdrant/js-client-rest";
import {PrismaClient} from "@prisma/client";

const pinecone = new Pinecone( {
    apiKey:  String(process.env.PINECONE_API_KEY)
});
const openai = new OpenAI({
    apiKey: String(process.env.OPENAPI_API_KEY)
})

const qdrant: QdrantClient = new QdrantClient({
    url: String(process.env.QDRANT_API_URL),
    apiKey: String(process.env.QDRANT_API_KEY)
})

const prisma = new PrismaClient();

export {pinecone, openai, qdrant, prisma}