import { openDb } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";
import type { Box } from "$lib/types";

export const POST: RequestHandler = async () => {
	const db = await openDb();

	const result = await db.run(`INSERT INTO boxes DEFAULT VALUES`);
	const box: Box | undefined = await db.get(`SELECT * FROM boxes WHERE id = ?`, result.lastID);

	return new Response(JSON.stringify(box), {
		status: 201,
		headers: { "Content-Type": "application/json" }
	});
};
