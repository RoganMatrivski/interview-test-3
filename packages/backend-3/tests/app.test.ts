import request from "supertest";
import app from "../app"; // Adjust the path as needed

describe("Data API", () => {
	beforeEach(async () => {
		await request(app).post("/reset");
	});

	it("should return empty data array", async () => {
		const res = await request(app).get("/data");
		expect(res.status).toBe(200);
		expect(res.body).toEqual([]);
	});

	it("should add new data", async () => {
		const newItem = { payload: "test" };
		const res = await request(app).post("/data").send(newItem);
		expect(res.status).toBe(201);
		expect(res.body).toEqual(newItem.payload);

		const getRes = await request(app).get("/data");
		expect(getRes.body).toContainEqual(newItem.payload);
	});

	it("should not add invalid data", async () => {
		const res = await request(app).post("/data").send("invalid");
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("error");
	});

	it("should update existing data", async () => {
		const originalItem = { payload: "original" };
		await request(app).post("/data").send(originalItem);

		const updatedItem = { payload: "updated" };
		const res = await request(app).put("/data/0").send(updatedItem);
		expect(res.status).toBe(200);
		expect(res.body).toEqual(updatedItem.payload);

		const getRes = await request(app).get("/data");
		expect(getRes.body[0]).toEqual(updatedItem.payload);
	});

	it("should return 404 for invalid update index", async () => {
		const res = await request(app).put("/data/99").send({ payload: "x" });
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("error");
	});

	it("should delete data item", async () => {
		const newItem = { payload: "to-delete" };
		await request(app).post("/data").send(newItem);

		const res = await request(app).delete("/data/0");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ message: "Data deleted" });

		const getRes = await request(app).get("/data");
		expect(getRes.body).not.toContainEqual(newItem);
	});

	it("should return 404 for invalid delete index", async () => {
		const res = await request(app).delete("/data/5");
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("error");
	});
});
