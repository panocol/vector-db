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

        let movies = await index.query({
            topK: 5,
            vector: vector,
            includeValues: true,
            includeMetadata: true
            // filter: { genre: { '$eq': 'action' }}
        });


        console.log('Stats:', stats)
        console.log('Query Results:', movies.matches.map(m => m.metadata));


    } catch (error) {
        console.error('Error querying Pinecone DB:', error);
    }
}

queryDB();
