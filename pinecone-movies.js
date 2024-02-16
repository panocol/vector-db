"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pinecone_1 = require("@pinecone-database/pinecone");
const pinecone = new pinecone_1.Pinecone({
    apiKey: '5ff5a9be-33a6-4e7b-92af-620e49bcc449'
});
function queryDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const indexName = "myIndex";
            const vectors = [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]];
            const index = pinecone.index(indexName);
            let movies = yield index.namespace('ns1').query({
                topK: 2,
                vector: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
                includeValues: true,
                includeMetadata: true,
                filter: { genre: { '$eq': 'action' } }
            });
            console.log('Query Results:', movies);
        }
        catch (error) {
            console.error('Error querying Pinecone DB:', error);
        }
    });
}
queryDB();
