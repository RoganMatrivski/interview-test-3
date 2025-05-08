import React, { useEffect, useState } from "react";
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
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    const res = await axios.get<User[]>(API);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      // Update user
      await axios.put<User>(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      // Create user
      await axios.post<User>(API, form);
    }
    setForm({ name: "", email: "" });
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`${API}/${id}`);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  const cancelEdit = () => {
    setForm({ name: "", email: "" });
    setEditingId(null);
  };

  return (
    <div>
      <h2>{editingId !== null ? "Edit User" : "Add User"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          required
        />
        <button type="submit">{editingId !== null ? "Update" : "Add"}</button>
        {editingId !== null && (
          <button onClick={cancelEdit} type="button">
            Cancel
          </button>
        )}
      </form>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email})
            <button onClick={() => handleEdit(u)}>Edit</button>
            <button onClick={() => handleDelete(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
