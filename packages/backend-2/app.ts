import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { expressjwt as jwt, type Request as JWTRequest } from "express-jwt";
import { jwtDecode } from "jwt-decode";
import { SignJWT } from "jose";

import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

// It's better to use string or uuid package
// because number type is imprecise in large numbers.
// But for now this'll do
interface User {
	id: number;
	username: string;
	password: string;
}

interface UserForm {
	username: string;
	password: string;
}

interface JwtAppPayload {
	userId: number;
	jti: string;
	iat: number;
	exp: number;
}

// biome-ignore lint/style/useConst: <explanation>
let users: User[] = [];
// biome-ignore lint/style/useConst: <explanation>
let revokedTokens: string[] = [];
let currUserId = 0;

// Please read included ".env" file
const JWT_TOKEN_STRING = process.env.JWT_SECRET;
if (!JWT_TOKEN_STRING) {
	throw new Error("Environment variable JWT_TOKEN is not defined");
}

const JWT_TOKEN = new TextEncoder().encode(JWT_TOKEN_STRING);

// If needed, change hashing function here.
const hashingFn = async (str: string) => await argon2.hash(str);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
	"/register",
	async (req: Request<object, object, UserForm>, res: Response) => {
		const { username, password } = req.body;

		if (!username || !password) {
			res.status(400).send("Bad Request: username and password are required");
			return;
		}

		const userExists = users.some((user) => user.username === username);

		if (userExists) {
			res.status(409).send("Conflict: username already exists");
			return;
		}

		users.push({
			id: currUserId,
			username,
			password: await hashingFn(password),
		});

		currUserId += 1;
		res.sendStatus(200);

		return;
	},
);

app.post(
	"/login",
	async (req: Request<object, object, UserForm>, res: Response) => {
		const { username, password } = req.body;

		if (!username || !password) {
			res.status(400).send("Bad Request: username and password are required");
			return;
		}

		const user = users.find((user) => user.username === username);

		if (!user) {
			res.status(404).send("Not Found: user does not exist");
			return;
		}

		const isPasswordValid = await argon2.verify(user.password, password);

		if (!isPasswordValid) {
			res.status(401).send("Unauthorized: invalid password");
			return;
		}

		const token = await new SignJWT({ userId: user.id })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("2h")
			.setJti(uuidv4())
			.sign(JWT_TOKEN);

		// The way to store JWT is complicated.
		// Since not specified, i'll store it on cookie for now
		res.cookie("Authorization", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "strict" : false,
		});

		res.status(200).send();
	},
);

app.get(
	"/profile",
	// Not interested in implementing JWT checking from scratch
	jwt({
		secret: JWT_TOKEN_STRING,
		algorithms: ["HS256"],
		isRevoked: async (req: Request, token) => {
			if (!token) {
				return false;
			}

			if (typeof token.payload === "string") {
				const payload: JwtAppPayload = JSON.parse(token.payload);
				return revokedTokens.includes(payload.jti);
			}

			if (!token.payload.jti) {
				return false;
			}

			return revokedTokens.includes(token.payload.jti);
		},
	}),
	(req: JWTRequest, res: Response) => {
		if (req.auth) {
			const { userId } = req.auth;
			const user = users.find((user) => user.id === userId);

			if (!user) {
				res.status(404).send("Not Found: user does not exist");
				return;
			}

			const { password, ...userWithoutPassword } = user;
			res.status(200).json(userWithoutPassword);
		} else {
			res.sendStatus(200);
		}

		return;
	},
);

// A bit of logout endpoint, as a treat
app.get("/logout", (req: Request, res: Response) => {
	// Get the Authorization cookie
	const token = req.cookies.Authorization;

	if (token) {
		const payload: JwtAppPayload = jwtDecode(token);
		revokedTokens.push(payload.jti);
	}

	// Clear the Authorization cookie
	res.clearCookie("Authorization", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "strict" : false,
	});

	res.status(200).send("Logged out successfully");
});

export default app;
