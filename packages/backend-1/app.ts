import express, { type Request, type Response } from "express";

// It's better to use string or uuid package
// because number type is imprecise in large numbers.
// But for now this'll do
interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

const app = express();

app.use(express.json());

let todos: Todo[] = [];
let nextId = 1;

app.get("/todos", (req: Request, res: Response) => {
	res.json(todos);
});

app.get("/todos/:id", (req: Request<{ id: string }>, res: Response) => {
	const id = Number.parseInt(req.params.id);
	const todo = todos.find((t) => t.id === id);

	if (!todo) {
		res.status(404).json({ error: "Todo not found" });
		return;
	}

	res.json(todo);
});

app.post("/todos", (req: Request, res: Response) => {
	const { title, completed } = req.body;

	if (typeof title !== "string" || typeof completed !== "boolean") {
		res.status(400).json({
			error:
				"Invalid request body. Expected title (string) and completed (boolean).",
		});

		return;
	}

	const newTodo: Todo = { id: nextId++, title, completed };
	todos.push(newTodo);
	res.status(201).json(newTodo);
});

app.put("/todos/:id", (req: Request<{ id: string }>, res: Response) => {
	const id = Number.parseInt(req.params.id);
	const { title, completed } = req.body;
	const todo = todos.find((t) => t.id === id);

	if (!todo) {
		res.status(404).json({ error: "Todo not found" });
		return;
	}

	if (typeof title !== "string" || typeof completed !== "boolean") {
		res.status(400).json({
			error:
				"Invalid request body. Expected title (string) and completed (boolean).",
		});
		return;
	}

	todo.title = title;
	todo.completed = completed;

	res.json(todo);
});

app.delete("/todos/:id", (req: Request<{ id: string }>, res: Response) => {
	const id = Number.parseInt(req.params.id);
	const index = todos.findIndex((t) => t.id === id);

	if (index === -1) {
		res.status(404).json({ error: "Todo not found" });
		return;
	}

	todos.splice(index, 1);
	res.status(204).send();
});

// RESET for testing
app.post("/reset", (_req, res) => {
	todos = [];
	nextId = 1;
	res.status(200).send("Reset done");
});

export default app;
