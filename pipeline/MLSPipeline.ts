import fs from "fs";
import {Listing, ListingVector, Prisma, PrismaClient} from "@prisma/client";
import {generateUuid5} from "weaviate-ts-client";
import {openai, prisma} from "../app";
import {createEmbedding} from "../helpers/insert_helpers";
import {DefaultArgs, GetFindResult} from "@prisma/client/runtime/library";

export abstract class MLSPipeline {


    /**
     * Update the search index with our new embeddings. Iterate through all our stored listings and metadata. Find entries
     * That need to be indexed and update them in our index.
     */
    abstract loadIndex(): Promise<void>;

    /**
     * Load the MLS pin data
     */
    async loadMLSPin(): Promise<void> {
        const listings = JSON.parse( fs.readFileSync("./tmp/mls-values.json", {
            encoding: "utf-8"
        }));

        const mlsPin = await prisma.listing.count();
        if (mlsPin >= listings.length) {
            console.log("We don't have new listings to add");
            return;
        }
        console.log(`We have ${mlsPin} listings to add and ${listings.length} to add`);

        const windowSize = 100;
        for (let left = 0; left < listings.length; left += windowSize) {
            const right = Math.min(left + windowSize, listings.length);
            console.log(`Processing MLS PIN ${left} to ${right} of ${listings.length}`);
            const data = listings.slice(left, right);
            // Create many does an upsert when generating the ID deterministically
            await prisma.listing.createMany({
                data: data.map((l: any) => {
                    return {
                        id: generateUuid5(l.ListingKey, "mls-pin"),
                        listingKey: l.ListingKey,
                        listPrice: l.ListPrice,
                        streetNumber: l.StreetNumber,
                        streetName: l.StreetName,
                        city: l.City,
                        stateOrProvince: l.StateOrProvince,
                        postalCode: l.PostalCode,
                        bedroomsTotal: l.BedroomsTotal,
                        bathroomsFull: l.BathroomsFull,
                        bathroomsHalf: l.BathroomsHalf,
                        lotSizeAcres: l.LotSizeAcres,
                        yearBuilt: l.YearBuilt,
                        propertyType: l.PropertyType,
                        propertySubType: l.PropertySubType,
                        standardStatus: l.StandardStatus,
                        listingId: l.ListingId,
                        latitude: l.Latitude,
                        longitude: l.Longitude,
                        privateOfficeRemarks: l.PrivateOfficeRemarks,
                        publicRemarks: l.PublicRemarks,
                        unitNumber: l.UnitNumber,
                        originalEntryTimestamp: new Date(),
                        modificationTimestamp: new Date(),
                        buildingAreaUnits: "sqft",
                        buildingAreaTotal: l.BuildingAreaTotal,
                        architecturalStyle: l.ArchitecturalStyle[0] || null,
                        showingInstructions: l.ShowingInstructions,
                        unparsedAddress: l.UnparsedAddress
                    }
                }), skipDuplicates: true
            })
        }
    }

    /**
     * Load landmarks from open street maps
     */
    async loadLandmarks(): Promise<void> {
        // TBD
    }

    protected createEmbedding(listing: Listing) {
        return `${listing.propertySubType} - ${listing.propertyType} - ${listing.publicRemarks} - ${listing.privateOfficeRemarks}`;
    }

    protected createMetadata(listing: Listing) {

        return {
            listingKey: listing.listingKey,
            listPrice: String(listing.listPrice),
            bathroomsFull: String(listing.bathroomsFull),
            bedroomsTotal: String(listing.bedroomsTotal),
            propertyType: String(listing.propertyType),
            city: String(listing.city),
            architecturalStyle: String(listing.architecturalStyle),
            showingInstructions: String(listing.showingInstructions),
            unparsedAddress: String(listing.unparsedAddress),
            latitude: String(listing.latitude),
            longitude: String(listing.longitude),
            propertySubType: String(listing.propertySubType),
            bathroomsHalf: String(listing.bathroomsHalf),
            buildingAreaTotal: String(listing.buildingAreaTotal),
            lotSizeAcres: String(listing.lotSizeAcres),
            yearBuilt: String(listing.yearBuilt),
            listingId: String(listing.listingId),
        }
    }

    public async dataWithEmbeddings(data: GetFindResult<Prisma.$ListingPayload<DefaultArgs>, {
        include: { vectors: boolean };
        where: { vectors: null }
    }>[]) {
        return await Promise.all(data.map(async (listing: Listing) => {

            try {
                const vector = await openai.embeddings.create({
                    input: createEmbedding(listing),
                    model: "text-embedding-ada-002",
                })
                return {
                    vector: vector.data[0].embedding,
                    listingId: listing.id
                }
            } catch (e) {
                throw new Error(`Error creating embedding for ${listing.listingKey}`)
            }

        }));
    }

    /**
     * Load the embeddings to database
     */
    async loadEmbeddings(): Promise<void> {
        let embeddings_file: any[] = [];

        const listingsWithoutEmbeddings = await prisma.listing.findMany({
            where: {
                vectors: null
            },
            include: {vectors: true},
            take: 10000
        });
        console.log(`Found ${listingsWithoutEmbeddings.length} vectors without data`);

        const windowSize = 100;
        for (let left = 0; left < listingsWithoutEmbeddings.length; left += windowSize) {
            const right = Math.min(left + windowSize, listingsWithoutEmbeddings.length);
            console.log(`Processing Embeddings ${left} to ${right} of ${listingsWithoutEmbeddings.length}`);
            const data = listingsWithoutEmbeddings.slice(left, right);
            if (data.length === 0) {
                break;
            }
            const dataWithEmbeddings = await this.dataWithEmbeddings(data);
            embeddings_file.push(...dataWithEmbeddings);

            await prisma.listingVector.createMany({
                data: dataWithEmbeddings
            })
        }
        fs.writeFileSync("./tmp/mls-embeddings.json", JSON.stringify(embeddings_file));
    }



    public async run(): Promise<void> {
        await this.loadMLSPin();
        await this.loadLandmarks();
        await this.loadEmbeddings();
        await this.loadIndex();
    }
}