import {openai, pinecone} from "./app"

async function getSearchVector() {
    const vector = await openai.embeddings.create({
        input: "I'd like to see something funny",
        model: "text-embedding-ada-002",
        // dimensions: 1536
    });

    return vector.data[0].embedding
}

async function queryDB() {
    try {

        const indexName = "sample-movies";
        const index = pinecone.index(indexName)
        const stats = await index.describeIndexStats();

        const vector = await getSearchVector()

        let start = performance.now()
        let movies = await index.query({
            topK: 2,
            vector: vector,
            includeValues: false,
            includeMetadata: false
            // filter: { genre: { '$eq': 'action' }}
        });
        let end = performance.now()


        console.log('Stats:', stats)
        console.log(`Query Time ${end - start} ms`)
        console.log('Query Results:', movies.matches);


    } catch (error) {
        console.error('Error querying Pinecone DB:', error);
    }
}

queryDB();
