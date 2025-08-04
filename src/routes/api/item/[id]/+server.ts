import { openDb } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params }) => {
	const db = await openDb();

	const id = params.id;

	if (!id) {
		return new Response(JSON.stringify({ error: "Missing item id" }), { status: 400, headers: { "Content-Type": "application/json" } });
	}

	try {
		const stmt = await db.prepare(`DELETE FROM items WHERE id = ?`);
		const result = await stmt.run(id);
		await stmt.finalize();

		if (result.changes === 0) {
			return new Response(JSON.stringify({ error: "Item not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
		}

		return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: "Database error" }), { status: 500, headers: { "Content-Type": "application/json" } });
	}
};
