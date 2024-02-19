const queryListings = require("./pinecone-mls");
exports.handler = async (event) => {
    console.log("Executing some event", event)
    queryListings(event.q)
}