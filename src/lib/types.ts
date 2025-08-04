export interface Box {
	id: number;
	created_at: string;
}

export type Item = {
	id: number;
	box_id: number;
	name: string;
	created_at: string;
};

export type Label = {
	id: number;
	date: Date; //Required or it bugs out!
};

export type BoxWithItems = Box & { items: Item[] };
