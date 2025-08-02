import { openDb } from '$lib/db';

//TODO optimize
// This code runs every request.
// Optimize it by only running it on server startup

export async function handle({ event, resolve }) {
  const db = await openDb();

  // On Server Start, Enable foreign keys in sqlite due them not being enabled on default.
  // After it we create the boxes and items db
  await db.exec(`PRAGMA foreign_keys = ON;`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS boxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      box_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE CASCADE
    );
  `);

  return resolve(event);
}
