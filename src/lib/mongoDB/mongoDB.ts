import { MongoClient } from "mongodb";

let uri = process.env.MONGODB_URI;
let dbName = "jia-db";

let cachedClient = null;
let cachedDb = null;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the dbName variable or set a default value"
  );
}

export default async function connectMongoDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    tls: true,
    tlsInsecure: true, // Allow insecure TLS for local development
    retryWrites: true,
    maxPoolSize: 10,
  });

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function disconnectFromDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
  }
}
