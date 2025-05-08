import { useState } from "react";

type ItemListProps = {
	items: string[];
};

// Gracefully stolen from: https://stackoverflow.com/a/52171480/10598076
// Ideally i would use a uuid library, but installing new library for simple
// hashing function feels a bit icky for me, so copy-paste it is.
// Used for element key id generation
const cyrb53 = (str: string, seed = 0) => {
	let h1 = 0xdeadbeef ^ seed;
	let h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch: number; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export default function ItemList({ items }: ItemListProps) {
	if (items.length <= 0) return;

	const [list, setList] = useState(items);

	const handleDelete = (indexToDelete: number) => {
		setList(list.filter((_, index) => index !== indexToDelete));
	};

	return (
		<ul>
			{list.map((item, index) => (
				<li key={cyrb53(item)}>
					{item}
					<button type="button" onClick={() => handleDelete(index)}>
						Delete
					</button>
				</li>
			))}
		</ul>
	);
}
