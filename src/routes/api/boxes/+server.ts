import { openDb } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { Box } from '$lib/types';

export const GET: RequestHandler = async () => {
  const db = await openDb();

  const boxes: Box[] = await db.all(`SELECT * FROM boxes ORDER BY created_at DESC`);

  return new Response(JSON.stringify(boxes), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};