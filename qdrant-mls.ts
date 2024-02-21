import {QdrantClient} from '@qdrant/js-client-rest'; // REST client
import {openai} from "./app"
import {createEmbedding, createMetadata, getListings} from "./helpers/insert_helpers";
import {sleep} from "openai/core";

const client: QdrantClient = new QdrantClient({
    url: "https://16819c47-9aca-4b07-8534-fac94301a651.us-east4-0.gcp.cloud.qdrant.io",
    port: 6333,
    apiKey: process.env.QDRANT_API_KEY
})

const className = 'test_collection';


async function getCollections() {
    let d = await client.getCollections()
    console.log(d)
}

getCollections();


// client.createCollection(className, {
//     vectors: {
//         size: 1536,
//         distance: "Cosine"
//     }
// })

async function importVectors() {
    // Get the questions directly from the URL
    const listings = getListings().slice(1000, 5000)

    let counter: number = 0;
    let pagesSynced = 0
    while (pagesSynced < listings.length) {
        const data = listings.slice(pagesSynced * 100, pagesSynced * 100 + 100)

        let points: any[] = []
        for (const item of data) {
            const vector = await openai.embeddings.create({
                input: createEmbedding(item),
                model: "text-embedding-ada-002",
            })

            points.push({
                id: item.ListingKey,
                vector: vector.data[0].embedding,
                payload: createMetadata(item)
            })
        }
        const res = await client.upsert(className, {
            points: points
        })

        console.log(`Upserted some records ${res}`)

        points = []
        pagesSynced++
    }
}

async function searchVectors(search: string) {
    const embedding = await openai.embeddings.create({
        input: search,
        model: "text-embedding-ada-002"
    });

    let start: any = performance.now()
    const response = await client.search(className, {
        vector: embedding.data[0].embedding,
        limit: 2
    })
    let end: any = performance.now()
    console.log(`Query Listing Execution time: ${end - start} ms`);
    return response
}

importVectors();
// searchVectors("Small house with 1 bedroom and a porch").then(data => console.log(data))