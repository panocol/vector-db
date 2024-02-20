const {queryListings} = require("./dist/pinecone-mls.js");

exports.handler = async (event) => {
    console.log("Executing some event", event)
    return queryListings(event.q)
}