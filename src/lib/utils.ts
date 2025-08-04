export function formatDate(datetime: string): string {
	const date = new Date(datetime);
	const pad = (n: number) => n.toString().padStart(2, "0");

	const day = pad(date.getDate());
	const month = pad(date.getMonth() + 1); // Maanden zijn 0-based
	const year = date.getFullYear();

	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());

	return `${day}-${month}-${year} ${hours}:${minutes}`;
}
