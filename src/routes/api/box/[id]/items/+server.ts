import { openDb } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";
import type { Box } from "$lib/types";

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) {
		return new Response("Invalid id", { status: 400 });
	}
	console.log(id);

	const db = await openDb();

	const box: Box | undefined = await db.get(`SELECT * FROM boxes WHERE id = ?`, id);
	if (!box) {
		return new Response("Box not found", { status: 404 });
	}

	await db.run(`DELETE FROM items WHERE box_id = ?`, id);

	return new Response(null, { status: 204 });
};
