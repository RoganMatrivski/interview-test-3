import type React from "react";
import { useState } from "react";

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

type PaginationProps = {
	items: string[];
	itemsPerPage: number;
};

const Pagination: React.FC<PaginationProps> = ({ items, itemsPerPage }) => {
	// No need for useEffect.
	// When currentPage changed, this component will rerender and
	// recalculates currentItems.
	const [currentPage, setCurrentPage] = useState<number>(1);

	const totalPages = Math.ceil(items.length / itemsPerPage);

	const startIdx = (currentPage - 1) * itemsPerPage;
	const currentItems = items.slice(startIdx, startIdx + itemsPerPage);

	const goToPage = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	};

	return (
		<div>
			<ul>
				{currentItems.map((item, idx) => (
					<li key={cyrb53(`item${idx}`)}>{item}</li>
				))}
			</ul>

			<div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
				<button
					type="button"
					onClick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Prev
				</button>

				{Array.from({ length: totalPages }, (_, i) => (
					<button
						type="button"
						key={cyrb53(`pages${i}`)}
						disabled={currentPage === i + 1}
						onClick={() => goToPage(i + 1)}
						style={{
							fontWeight: currentPage === i + 1 ? ("bold" as const) : "normal",
						}}
					>
						{i + 1}
					</button>
				))}

				<button
					type="button"
					onClick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default Pagination;
