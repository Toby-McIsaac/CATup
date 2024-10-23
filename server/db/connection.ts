import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

const uri = process.env.ATLAS_URI || "ERROR";
console.log(uri);

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function connectToDatabase() {
	try {
		// Connect the client to the server
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} catch (err) {
		console.error(err);
	}
}

connectToDatabase().catch(console.error);

const db = client.db();

export default db;