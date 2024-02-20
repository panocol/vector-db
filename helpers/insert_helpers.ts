import fs from "fs";

function getListings(): any{
    // axios.get("https://api.bridgedataoutput.com/api/v2/OData/mlspin/Property?access_token=7016ecb8678df5cbde06715314d71bc7")
    const homes = JSON.parse( fs.readFileSync("./tmp/mls-values.json", {
        encoding: "utf-8"
    }));
    return homes.slice(600, 900).map((listing: any) => {
        return {
            ListingKey: String(listing.ListingKey),
            PropertyType: String(listing.PropertyType),
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
        ListingKey: listing.ListingKey
    }
}

export {getListings, createEmbedding, createMetadata}