import { openDb } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";
import type { Box, Item } from "$lib/types";

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) {
		return new Response("Invalid id", { status: 400 });
	}

	const db = await openDb();

	const box: Box | undefined = await db.get(`SELECT * FROM boxes WHERE id = ?`, id);
	if (!box) {
		return new Response("Box not found", { status: 404 });
	}

	const items: Item[] = await db.all(`SELECT * FROM items WHERE box_id = ?`, id);

	const result: Box & { items: Item[] } = {
		...box,
		items
	};

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) {
		return new Response("Invalid id", { status: 400 });
	}

	const db = await openDb();

	const box: Box | undefined = await db.get(`SELECT * FROM boxes WHERE id = ?`, id);
	if (!box) {
		return new Response("Box not found", { status: 404 });
	}

	await db.run(`DELETE FROM boxes WHERE id = ?`, id);

	return new Response(null, { status: 204 });
};
