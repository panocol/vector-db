# Homwel Pipeline Poc

## Steps to run pipline

Setup db and vector index
```markdown
make db-up
```


Run the Pipeline
```markdown
npm run pipeline
```

This pipeline will Execute `QdrantMLSPipline.run()`. Which will
1. Load data from a mls listings json file to cockroach DB.
2. generate vector embeddings using open api and cache those embeddings in cockroach DB.
3. use those embeddings and upsert them along with real estate metadata
to a local Qdrant index.









-----------------
Notes

```
npm install @pinecone-database/pinecone
npm install --save-dev typescript @types/node
npm install --save-dev ts-node
npx tsc --init
npm install openai dotenv
```

Plugins
```markdown
TypeScript

```

## Prisma ORM
Setup the prima schemas
```
npx prisma init --datasource-provider cockroachdb
```

##### Use the schemas to sync the local DB
Env File
```markdown
DATABASE_URL="postgresql://cockroach:cockroach@127.0.0.1:26257/defaultdb"
```
Terminal Run
```markdown
npx prisma migrate dev --name init
```

##### Local Testing
Make changes to your schema.prisma file and then run
```markdown
npx prisma db push
```
to test out DB changes with your app.