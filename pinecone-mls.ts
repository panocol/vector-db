import {pinecone, openai} from "./app"
import axios from "axios";
import * as fs from "fs";

const index = pinecone.index("mls-pin");

function getListings(): object[]{
    // axios.get("https://api.bridgedataoutput.com/api/v2/OData/mlspin/Property?access_token=7016ecb8678df5cbde06715314d71bc7")
    const homes = JSON.parse( fs.readFileSync("./tmp/mls-values.json", {
        encoding: "utf-8"
    }));
    return homes.slice(0, 100).map((listing: any) => {
        return {
            ListingKey: listing.ListingKey,
            ShowingInstructions: listing.ShowingInstructions,
            StreetName: listing.StreetName,
            BathroomsFull: listing.BathroomsFull,
            BedroomsTotal: listing.BedroomsTotal,
            LotSizeAcres: listing.LotSizeAcres,
            PostalCode: listing.PostalCode,
            PropertyType: listing.PropertyType,
            ListPrice: listing.ListPrice,
            StandardStatus: listing.StandardStatus,
            StreetNumber: listing.StreetNumber,
            ListingId: listing.ListingId,
            YearBuilt: listing.YearBuilt,
            StateOrProvince: listing.StateOrProvince,
            ArchitecturalStyle: listing.ArchitecturalStyle,
            City: listing.City,
            BathroomsHalf: listing.BathroomsHalf,
            PropertySubType: listing.PropertySubType,
            BuildingAreaTotal: listing.BuildingAreaTotal,
            PrivateOfficeRemarks: listing.PrivateOfficeRemarks,
            PublicRemarks: listing.PublicRemarks
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
    const testListing: any = listings[0]
    const vector = await openai.embeddings.create({
        input: createEmbedding(testListing),
        model: "text-embedding-ada-002",
    });

    index.namespace('sample').upsert([
        {
            id: testListing.ListingKey,
            values: vector.data[0].embedding,
            metadata: testListing
        }
    ])
}

// uploadListings(getListings())
console.log(createEmbedding(getListings()[0]))

index.namespace('sample').query({
        id: "653207c52a9d54bf632357f73d5c6cbd",
        topK: 2
    }
).then(data => {
    console.log(data)
});

