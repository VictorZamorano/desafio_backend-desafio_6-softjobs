import * as dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { handleErrors } from "../db/errors.js";

const validtToken = (req, res, next) => {
	try {
		const tokenHeaders = req.headers.authorization;

		if (!tokenHeaders) {
			throw { message: "Se necesita un token para tu validación" };
		}

		const token = tokenHeaders.split(" ")[1];

		const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

		req.email = payload.email;
		next();
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

export const myMdleWare = { validtToken };
