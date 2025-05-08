import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

interface AppPayload {
	payload: string;
}

let data_array: string[] = [];

// RESET for testing
app.post("/reset", (_req, res) => {
	data_array = [];
	res.status(200).send("Reset done");
});

// GET /data - return all data
app.get("/data", (_req: Request, res: Response) => {
	res.json(data_array);
});

// POST /data - add new data item
app.post("/data", (req: Request<object, object, AppPayload>, res: Response) => {
	const { payload } = req.body;

	if (!payload) {
		res.status(400).json({ error: "Payload cannot be empty" });
		return;
	}

	data_array.push(payload);
	res.status(201).json(payload);
});

// PUT /data/:id - update existing data by index
// Update prolly has little to optimize tbh
app.put(
	"/data/:id",
	(req: Request<{ id: number }, object, AppPayload>, res: Response) => {
		const id = Number(req.params.id);

		if (Number.isNaN(id) || id < 0 || id >= data_array.length) {
			res.status(404).json({ error: "Invalid ID" });
			return;
		}

		if (!req.body.payload) {
			res.status(400).json({ error: "Payload cannot be empty" });
			return;
		}

		data_array[id] = req.body.payload;
		res.json(req.body.payload);
	},
);

// DELETE /data/:id - remove data by index
app.delete(
	"/data/:id",
	(req: Request<{ id: number }, object, AppPayload>, res: Response) => {
		const id = Number(req.params.id);

		if (Number.isNaN(id) || id < 0 || id >= data_array.length) {
			res.status(404).json({ error: "Invalid ID" });
			return;
		}

		// Splice is overall has better speed and low memory
		// due to in-place mutation that doesn't allocate memory
		// For a better speed, use filter.
		// Benchies: https://www.measurethat.net/Benchmarks/Show/10098/0/remove-item-from-array-by-index
		data_array.splice(id, 1);
		res.json({ message: "Data deleted" });
	},
);

export default app;
