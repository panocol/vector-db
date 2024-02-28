import fs from "fs";

function getListings(): any[]{
    // axios.get("https://api.bridgedataoutput.com/api/v2/OData/mlspin/Property?access_token=7016ecb8678df5cbde06715314d71bc7")
    const homes = JSON.parse( fs.readFileSync("./tmp/mls-values.json", {
        encoding: "utf-8"
    }));
    return homes.map((listing: any) => {
        return {
            ListingKey: String(listing.ListingKey),
            PropertyType: String(listing.PropertyType),
            StreetName: String(listing.StreetName),
            BathroomsFull: String(listing.BathroomsFull),
            BedroomsTotal: String(listing.BedroomsTotal),
            LotSizeAcres: String(listing.LotSizeAcres),
            PostalCode: String(listing.PostalCode),
            ListPrice: String(listing.ListPrice),
            StandardStatus: String(listing.StandardStatus),
            StreetNumber: String(listing.StreetNumber),
            ListingId: String(listing.ListingId),
            YearBuilt: String(listing.YearBuilt),
            StateOrProvince: String(listing.StateOrProvince),
            ArchitecturalStyle: String(listing.ArchitecturalStyle),
            City: String(listing.City),
            PropertySubType: String(listing.PropertySubType),
            PrivateOfficeRemarks: String(listing.PrivateOfficeRemarks),
            PublicRemarks: String(listing.PublicRemarks)
        }
    })
}

function createEmbedding(listing: any) {
    return `${listing.PropertySubType} - ${listing.PropertyType} - ${listing.PublicRemarks} - ${listing.PrivateOfficeRemarks}`;
}

function createMetadata(listing: any) {
    return {
        ListingKey: listing.ListingKey,
        ListPrice: String(listing.ListPrice),
        BathroomsFull: String(listing.BathroomsFull),
        BedroomsTotal: String(listing.BedroomsTotal),
        PropertyType: String(listing.PropertyType),
        City: String(listing.City)
    }
}

export {getListings, createEmbedding, createMetadata}

/**
 Thoughts on structing vectors:
 Enhancing information from MLS
 1. Fetch the nearby landmarks for listing from Open Street Maps.
 2. Add additonal fields to the index which we've hydrated for each listing.
 3. Add additional filters to the document in the vector DB.
 4. Take images and pass to openAI to learn more about listings.
 How do we know when to put something in the vector vs put something in the filter fields?
 */