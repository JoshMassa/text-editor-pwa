import { openDB } from 'idb';

const initdb = async () => {
  try {
    const db = await openDB('jate', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('jate')) {
          db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
          console.log('jate database created');
        } else {
          console.log('jate database already exists');
        }
      },
    });
  } catch (error) {
    console.error('Error initializing database: ', error);
  }
};

// Function to add new content to the database; this will auto-increment the ID
export const addNewEntry = async (content) => {
  try {
    const db = await openDB('jate', 1);
    const tx = db.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    const result = await store.add({ content });
    await tx.complete;
    console.log('New entry added to the database with an ID of: ', result);
    return result;
  } catch (error) {
    console.error('Failed to add new entry: ', error);
  }
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  try {
    console.log('GET all from the database');
    const db = await openDB('jate', 1);
    const tx = db.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const result = await store.getAll();
    console.log('All entries fetched from the database: ', result);
    return result;
  } catch (error) {
    console.error('Error fetching from the database: ', error);
  }
};

initdb();