import { openDb } from "$lib/db";

let InitPromise: Promise<void> | null = null;

async function InitDB() {
	const db = await openDb();

	await db.exec(`PRAGMA foreign_keys = ON;`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS boxes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
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
}

InitPromise = init();

async function init() {
	await InitDB();
}

export async function handle({ event, resolve }) {
	// Ensure the DB is initialized before handling requests
	await InitPromise;
	return resolve(event);
}
