import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Pagination from "./Pagination";

// Testing function to generate n amount of random strings of l length
function generateRandomStrings(n: number, l: number) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const result = [];

	for (let i = 0; i < n; i++) {
		let str = "";
		for (let j = 0; j < l; j++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			str += characters[randomIndex];
		}
		result.push(str);
	}

	return result;
}

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Pagination items={generateRandomStrings(30, 10)} itemsPerPage={10} />
		</>
	);
}

export default App;
