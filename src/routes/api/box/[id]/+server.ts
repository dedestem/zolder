import { openDb } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { Box } from '$lib/types';

export const GET: RequestHandler = async ({ params }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
        return new Response('Invalid id', { status: 400 });
    }

    const db = await openDb();

    const box: Box | undefined = await db.get(`SELECT * FROM boxes WHERE id = ?`, id);

    if (!box) {
        return new Response('Box not found', { status: 404 });
    }

    return new Response(JSON.stringify(box), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
