import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);
await client.connect();
export const database = client.db("gc02");
