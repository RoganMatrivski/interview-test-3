import request from "supertest";
import app from "../app";

describe("Todo API", () => {
	beforeEach(async () => {
		await request(app).post("/reset");
	});

	it("should create a todo independently", async () => {
		const sentObj = {
			title: "Todo A",
			completed: false,
		};
		const res = await request(app).post("/todos").send(sentObj);
		expect(res.status).toBe(201);
		expect(res.body).toMatchObject(sentObj);
	});

	it("should get all todos after creating one", async () => {
		await request(app)
			.post("/todos")
			.send({ title: "Todo B", completed: true });
		const res = await request(app).get("/todos");
		expect(res.status).toBe(200);
		expect(res.body.length).toBe(1);
		expect(res.body[0].title).toBe("Todo B");
	});

	it("should get one specific todo", async () => {
		const create = await request(app)
			.post("/todos")
			.send({ title: "Todo C", completed: true });
		const id = create.body.id;
		const res = await request(app).get(`/todos/${id}`);
		expect(res.status).toBe(200);
		expect(res.body.id).toBe(id);
	});

	it("should return 404 for unknown todo ID", async () => {
		const res = await request(app).get("/todos/999");
		expect(res.status).toBe(404);
	});

	it("should update a todo", async () => {
		const { body } = await request(app)
			.post("/todos")
			.send({ title: "Todo D", completed: false });
		const res = await request(app)
			.put(`/todos/${body.id}`)
			.send({ title: "Updated D", completed: true });
		expect(res.status).toBe(200);
		expect(res.body.title).toBe("Updated D");
	});

	it("should delete a todo", async () => {
		const { body } = await request(app)
			.post("/todos")
			.send({ title: "Todo E", completed: true });
		const deleteRes = await request(app).delete(`/todos/${body.id}`);
		expect(deleteRes.status).toBe(204);

		const getRes = await request(app).get(`/todos/${body.id}`);
		expect(getRes.status).toBe(404);
	});

	it("should reject bad POST data", async () => {
		const res = await request(app)
			.post("/todos")
			.send({ title: 123, completed: "no" });
		expect(res.status).toBe(400);
	});

	it("should reject bad PUT data", async () => {
		const { body } = await request(app)
			.post("/todos")
			.send({ title: "F", completed: false });
		const res = await request(app)
			.put(`/todos/${body.id}`)
			.send({ title: [], completed: "bad" });
		expect(res.status).toBe(400);
	});
});
