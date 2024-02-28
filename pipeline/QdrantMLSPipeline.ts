import { MLSPipeline } from "./MLSPipeline";
import {qdrant, prisma } from "../app";
export class QdrantMLSPipeline extends MLSPipeline {

  constructor() {
    super();
  }

  async loadIndex(): Promise<void> {
    try {
      await qdrant.createCollection("mls-pin", {
        vectors: {
          size: 1536,
          distance: "Cosine"
        }
      });
    } catch (e) {
      console.log("Collection mls-pin already exists")
    }

    const listings = await prisma.listing.findMany({
      where: {
        vectors: {
          vector: {
            isEmpty: false
          }
        }
      },
      include: {
        vectors: true
      }
    });

    let pagesSynced = 0
    let pageSize = 10
    while (pagesSynced*pageSize < listings.length) {
      const window = listings.slice(pagesSynced * pageSize, pagesSynced * pageSize + pageSize)

      let points: any[] = []
      for (const listing of window) {
        if (listing.vectors) {
          points.push({
            id: listing.id,
            vector: listing.vectors.vector,
            payload: this.createMetadata(listing)
          })
        }
      }

      try {
        const res = await qdrant.upsert("mls-pin", {
          points: points
        })
      } catch (e) {
        console.log(`Error upserting records to qdrant ${e}, points: ${points}`)
        throw new Error(`Error upserting records to qdrant ${e}, points: ${points}`)
      }


      points = []
      pagesSynced++
    }
    console.log(`Upserted ${listings.length} records to qdrant`)
  }


}