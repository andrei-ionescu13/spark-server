import { Collection, MongoClient } from 'mongodb';

const URI = process.env.MONGO_URI as string;
const DB_NAME = 'new-architecture-test';

if (!URI) {
  throw new Error('MONGO_URI is not defined');
}

export class Mongo {
  private static client = new MongoClient(URI);

  static async connect(): Promise<void> {
    await this.client.connect();
  }

  static getCollection<T extends object = any>(name: string): Collection<T> {
    return this.client.db(DB_NAME).collection<T>(name);
  }
}
