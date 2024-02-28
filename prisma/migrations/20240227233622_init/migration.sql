-- CreateTable
CREATE TABLE "Listing" (
    "id" STRING NOT NULL DEFAULT gen_random_uuid(),
    "listPrice" INT4,
    "latitude" FLOAT8,
    "longitude" FLOAT8,
    "streetNumber" STRING,
    "streetName" STRING,
    "unitNumber" STRING,
    "city" STRING,
    "stateOrProvince" STRING,
    "postalCode" STRING,
    "listingKey" STRING,
    "listingId" STRING,
    "standardStatus" STRING,
    "propertyType" STRING,
    "propertySubType" STRING,
    "privateOfficeRemarks" STRING,
    "publicRemarks" STRING,
    "originalEntryTimestamp" TIMESTAMP(3),
    "modificationTimestamp" TIMESTAMP(3),
    "bedroomsTotal" INT4,
    "bathroomsFull" INT4,
    "bathroomsHalf" INT4,
    "buildingAreaUnits" STRING,
    "buildingAreaTotal" INT4,
    "lotSizeAcres" INT4,
    "yearBuilt" INT4,
    "architecturalStyle" STRING,
    "showingInstructions" STRING,
    "unparsedAddress" STRING,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingLandMarks" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "landmarks" STRING NOT NULL,
    "listingId" STRING NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingLandMarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingVector" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "vector" INT4[],
    "listingId" STRING NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingVector_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListingLandMarks" ADD CONSTRAINT "ListingLandMarks_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingVector" ADD CONSTRAINT "ListingVector_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
