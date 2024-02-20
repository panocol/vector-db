import {pinecone, openai} from "./app"
import {createEmbedding, createMetadata, getListings} from "./helpers/insert_helpers";

const index = pinecone.index("mls");


async function uploadListings(listings: object[]) {

    listings.forEach((l:any) => {
        openai.embeddings.create({
            input: createEmbedding(l),
            model: "text-embedding-ada-002",
        }).then(vector => {
            const start= performance.now()
            index.namespace('sample').upsert([
                {
                    id: l.ListingKey,
                    values: vector.data[0].embedding,
                    metadata: createMetadata(l)
                }
            ]).then(data => console.log(`Upsert Query Timing ${performance.now() - start} ms`))
        });
    })

}

async function queryListings(search: string) {
    const embedding = await openai.embeddings.create({
        input: search,
        model: "text-embedding-ada-002"
    });
    const start: any = performance.now()
    const query: any = await index.namespace('sample').query({
            topK: 2,
            vector: embedding.data[0].embedding,
            includeMetadata: true,
            includeValues: true
        }
    );
    const end: any = performance.now()
    console.log(`Query Listing Execution time: ${end - start} ms`);
    return query
}

// uploadListings(getListings())

queryListings("Small house with 1 bedroom and a porch").then(d => {
    console.log(d.metadata)
})
// console.log(createEmbedding(getListings()[0]))

export {queryListings}
