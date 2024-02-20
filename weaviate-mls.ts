import weaviate, { WeaviateClient, ObjectsBatcher, ApiKey } from 'weaviate-ts-client';
import {openai} from "./app"
import {createEmbedding, createMetadata, getListings} from "./helpers/insert_helpers";

const client: WeaviateClient = weaviate.client({
    scheme: 'https',
    host: 'mls-fvvwitv3.weaviate.network',  // Replace with your endpoint
    apiKey: new ApiKey(String(process.env.WEAVIATE_API_KEY)),
    headers: { 'X-OpenAI-Api-Key': String(process.env.PINECONE_API_KEY) },  // Replace with your inference API key
});


const className = 'Pin';
const classObj = {
    class: className,
    vectorizer: 'none',
};



// Uncomment to delete all Question objects if you see a "Name 'Question' already used" error
// await client.schema.classDeleter().withClassName(className).do();

// Add the class to the schema
// client.schema.classCreator().withClass(classObj).do();
async function importVectors() {
    // Get the questions directly from the URL
    const data = getListings()

    let counter: number = 0;
    for (const item of data) {
        openai.embeddings.create({
            input: createEmbedding(item),
            model: "text-embedding-ada-002",
        }).then(vector => {
            client.data
                .creator()
                .withClassName(className)
                .withProperties(createMetadata(item))
                .withVector(vector.data[0].embedding)
                .withId(item.ListingKey)
                .do().then(data => {
                    console.log("finished inserting one", data)
                    counter++
                });

        })
    }
}

async function searchVectors(search: string) {
    const embedding = await openai.embeddings.create({
        input: search,
        model: "text-embedding-ada-002"
    });

    let start: any = performance.now()
    const response = await client.graphql
        .get()
        .withClassName(className)
        .withFields('listingKey')
        .withNearVector({ vector: embedding.data[0].embedding })
        .withLimit(2)
        .do();
    let end: any = performance.now()
    console.log(`Query Listing Execution time: ${end - start} ms`);
    return response
}

// importVectors();
searchVectors("Small house with 1 bedroom and a porch").then(data => console.log(data.data.Get.Pin))