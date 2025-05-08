import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
	id: number;
	name: string;
	email: string;
}

const API = "http://localhost:4000/users";

function App() {
	const [users, setUsers] = useState<User[]>([]);
	const [form, setForm] = useState<{ name: string; email: string }>({
		name: "",
		email: "",
	});

	const fetchUsers = async () => {
		const res = await axios.get<User[]>(API);
		setUsers(res.data);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await axios.post<User>(API, form);
		setForm({ name: "", email: "" });
		fetchUsers();
	};

	const handleDelete = async (id: number) => {
		await axios.delete(`${API}/${id}`);
		fetchUsers();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div>
			<h2>Users CRUD</h2>
			<form onSubmit={handleSubmit}>
				<input
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					placeholder="Name"
				/>
				<input
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
					placeholder="Email"
				/>
				<button type="submit">Add</button>
			</form>
			<ul>
				{users.map((u) => (
					<li key={u.id}>
						{u.name} ({u.email})
						<button type="submit" onClick={() => handleDelete(u.id)}>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
