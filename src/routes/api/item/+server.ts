import { openDb } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";
import type { Item } from "$lib/types";

export const POST: RequestHandler = async ({ request }) => {
	const db = await openDb();
	const data = await request.json();

	const { box_id, name } = data;

	if (!box_id || !name) {
		return new Response(JSON.stringify({ error: "Missing box_id or name" }), { status: 400, headers: { "Content-Type": "application/json" } });
	}

	try {
		const stmt = await db.prepare(`INSERT INTO items (box_id, name) VALUES (?, ?)`);
		const result = await stmt.run(box_id, name);
		await stmt.finalize();

		// Query the inserted row to get the exact created_at
		const row = await db.get<Item>(`SELECT id, box_id, name, created_at FROM items WHERE id = ?`, result.lastID);

		return new Response(JSON.stringify(row), { status: 201, headers: { "Content-Type": "application/json" } });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: "Database error" }), { status: 500, headers: { "Content-Type": "application/json" } });
	}
};
