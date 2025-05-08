import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import router from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = new Koa();
app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
