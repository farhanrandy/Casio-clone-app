import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

if (uri) {
	client = new MongoClient(uri);
	clientPromise = client.connect();
}

export async function getDatabase() {
	if (!clientPromise) {
		throw new Error("MONGODB_URI is not set");
	}
	const connectedClient = await clientPromise;
	return connectedClient.db("gc02");
}
