import type React from "react";
import { useState } from "react";
import Field from "./Field";
import "./App.css";

type FormTypes = {
	name: string;
	email: string;
};

type FormErrors = Partial<FormTypes>;

function App() {
	const [form, setForm] = useState<FormTypes>({ name: "", email: "" });
	const [errors, setErrors] = useState<FormErrors>({});

	const validate = () => {
		const newErrors: FormErrors = {};
		if (!form.name.trim()) {
			newErrors.name = "Name is required";
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(form.email)) {
			newErrors.email = "Email is invalid";
		}
		return newErrors;
	};

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const validationErrors = validate();
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			alert("Form submitted is valid!");
			// Optionally reset form here
		}
	};

	return (
		<div style={{ padding: "2rem" }}>
			<h2>Simple Form</h2>
			<form onSubmit={handleSubmit}>
				<Field
					label="Name"
					type="text"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					error={errors.name}
				/>
				<Field
					label="Email"
					type="email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
					error={errors.email}
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default App;
