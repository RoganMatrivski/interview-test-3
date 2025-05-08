import Router from "koa-router";
import pool from "./db";
import type { Context } from "koa";

const router = new Router();

// Get all users
router.get("/users", async (ctx: Context) => {
	const result = await pool.query("SELECT * FROM users");
	ctx.body = result.rows;
});

// Get user by ID
router.get("/users/:id", async (ctx: Context) => {
	const id = ctx.params.id;
	const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
	ctx.body = result.rows[0];
});

// Create user
router.post("/users", async (ctx: Context) => {
	const { name, email } = ctx.request.body;
	const result = await pool.query(
		"INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
		[name, email],
	);
	ctx.body = result.rows[0];
});

// Update user
router.put("/users/:id", async (ctx: Context) => {
	const id = ctx.params.id;
	const { name, email } = ctx.request.body;
	const result = await pool.query(
		"UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
		[name, email, id],
	);
	ctx.body = result.rows[0];
});

// Delete user
router.delete("/users/:id", async (ctx: Context) => {
	const id = ctx.params.id;
	await pool.query("DELETE FROM users WHERE id = $1", [id]);
	ctx.status = 204;
});

export default router;
