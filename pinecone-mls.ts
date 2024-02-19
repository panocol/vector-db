import {pinecone, openai} from "./app"
import axios from "axios";
import * as fs from "fs";

const index = pinecone.index("mls-pin");

function getListings(): object[]{
    // axios.get("https://api.bridgedataoutput.com/api/v2/OData/mlspin/Property?access_token=7016ecb8678df5cbde06715314d71bc7")
    const homes = JSON.parse( fs.readFileSync("./tmp/mls-values.json", {
        encoding: "utf-8"
    }));
    return homes.slice(800, 1000).map((listing: any) => {
        return {
            ListingKey: String(listing.ListingKey),
            ShowingInstructions: String(listing.ShowingInstructions),
            StreetName: String(listing.StreetName),
            BathroomsFull: String(listing.BathroomsFull),
            BedroomsTotal: String(listing.BedroomsTotal),
            LotSizeAcres: String(listing.LotSizeAcres),
            PostalCode: String(listing.PostalCode),
            PropertyType: String(listing.PropertyType),
            ListPrice: String(listing.ListPrice),
            StandardStatus: String(listing.StandardStatus),
            StreetNumber: String(listing.StreetNumber),
            ListingId: String(listing.ListingId),
            YearBuilt: String(listing.YearBuilt),
            StateOrProvince: String(listing.StateOrProvince),
            ArchitecturalStyle: String(listing.ArchitecturalStyle),
            City: String(listing.City),
            BathroomsHalf: String(listing.BathroomsHalf),
            PropertySubType: String(listing.PropertySubType),
            BuildingAreaTotal: String(listing.BuildingAreaTotal),
            PrivateOfficeRemarks: String(listing.PrivateOfficeRemarks),
            PublicRemarks: String(listing.PublicRemarks)
        }
    })
}

function createEmbedding(listing: object) {
    let embedding = '';
    for (const [key, value] of Object.entries(listing)) {
        embedding += `${key}: ${value}\n`;
    }
    return embedding;
}

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
                    metadata: l
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

    let start: any = performance.now()
    const query: any = await index.namespace('sample').query({
            topK: 2,
            vector: embedding.data[0].embedding,
            includeValues: true,
            includeMetadata: true
        }
    );
    let end: any = performance.now()
    console.log(`Execution time: ${end - start} ms`);
    return query
}

// uploadListings(getListings())


queryListings("Small house with 1 bedroom and a porch").then(data => console.log(data.matches.map((m:any) => m.metadata)))
// console.log(createEmbedding(getListings()[0]))



