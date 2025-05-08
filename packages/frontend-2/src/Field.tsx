import type React from "react";

type FieldProps = {
	label: string;
	type: React.HTMLInputTypeAttribute;
	value: string | number | readonly string[];
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	error: string | undefined;
};

function Field({ label, type, value, onChange, error }: FieldProps) {
	return (
		<div style={{ marginBottom: "1rem" }}>
			<label>
				{label}
				<br />
				<input
					type={type}
					value={value}
					onChange={onChange}
					style={{ borderColor: error ? "red" : "#ccc" }}
				/>
			</label>
			{error && <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>}
		</div>
	);
}

export default Field;
