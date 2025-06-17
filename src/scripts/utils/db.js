import { openDB } from 'idb';

const DB_NAME = 'cerita-db';
const DB_VERSION = 1;
const STORE_NAME = 'cerita';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  },
});

const CeritaDB = {
  async simpanCeritaOffline(cerita) {
    return (await dbPromise).add(STORE_NAME, cerita);
  },
  async semuaCerita() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async hapusCerita(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  }
};

export default CeritaDB;
