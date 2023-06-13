import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import myRouter from "./routes/routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", myRouter);

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
	console.log("SERVER ON", "http://localhost:" + PORT);
});
