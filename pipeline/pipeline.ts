import {QdrantMLSPipeline} from "./QdrantMLSPipeline"

const pipeline = new QdrantMLSPipeline()
pipeline.run().then(() => {
    console.log("Pipeline finished")
})