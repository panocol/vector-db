# Homwel Pipeline Poc

Setup with

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