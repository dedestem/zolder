import { openDb } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get("q") || "";

	const db = await openDb();

	const items = await db.all(
		`
		SELECT items.id, items.name, boxes.id as box_id
		FROM items
		JOIN boxes ON items.box_id = boxes.id
		WHERE items.name LIKE ?
		ORDER BY items.name ASC
		LIMIT 50
	`,
		[`%${q}%`]
	);

	return new Response(JSON.stringify(items), {
		headers: {
			"Content-Type": "application/json"
		}
	});
};
