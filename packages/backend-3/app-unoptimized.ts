const express = require("express");
const app = express();
let data = [];
app.get("/data", (req, res) => {
	res.json(data);
});
app.post("/data", (req, res) => {
	const newData = req.body;
	data.push(newData);
	res.json(newData);
});
app.put("/data/:id", (req, res) => {
	const id = req.params.id;
	const updatedData = req.body;
	data[id] = updatedData;
	res.json(updatedData);
});
app.delete("/data/:id", (req, res) => {
	const id = req.params.id;
	data.splice(id, 1);
	res.json({ message: "Data deleted" });
});

export default app;
