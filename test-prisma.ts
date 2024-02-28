import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addListings() {
  await prisma.listing.create({
    data: {
      listingKey: "123",
      listPrice: 1000000,
      streetNumber: "123",
      streetName: "Main St",
      city: "San Francisco",
      stateOrProvince: "CA",
      postalCode: "94105",
      bedroomsTotal: 2,
      bathroomsFull: 2,
      bathroomsHalf: 1,
      lotSizeAcres: 2000,
      yearBuilt: 2020,
      propertyType: "Single Family",
      propertySubType: "Residential",
      standardStatus: "Active",
      listingId: "123",
      latitude: 37.7749,
      longitude: -122.4194,
      privateOfficeRemarks: "This is a private office remark",
      publicRemarks: "This is a public remark",
      unitNumber: "123",
      originalEntryTimestamp: new Date(),
      modificationTimestamp: new Date(),
      buildingAreaUnits: "sqft",
      buildingAreaTotal: 2000,
      architecturalStyle: "Modern",
      showingInstructions: "Call or text for showing",
      unparsedAddress: "123 Main St, San Francisco, CA 94105",
      vectors: {
        create: {
          vector: [1,2,3,4,5]
        }
      },
      landmarks: {
        create: {
          landmarks: "Golden Gate Bridge"
        }
      }
    }
  })
}

async function main() {
  await addListings();

  // const allListings = await prisma.listing.findMany({
  //   include: { landmarks: true, vectors: true}
  // })
  // allListings.forEach((listing: any) => console.log(listing))

  const v = await prisma.listing.findMany({where: {vectors: null}, include: {vectors: true}});
  console.log(`Found ${v.length} vectors without data`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })