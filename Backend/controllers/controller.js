import { handleErrors } from "../db/errors.js";
import { myModels } from "../models/model.js";

const get = async (req, res) => {
	res.json({ ok: true, msg: "Server ON" });
};

const getUsers = async (req, res) => {
	try {
		const users = await myModels.getUsers();
		res.status(200).json({ ok: true, users });
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

const getUserById = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await myModels.getUserById(id);
		res.status(200).json({ ok: true, user });
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

const postRegister = async (req, res) => {
	const { email, password, rol, lenguage } = req.body;

	try {
		const register = await myModels.registerNewUser(
			email,
			password,
			rol,
			lenguage
		);
		console.log(register);
		res.status(200).json({ ok: true, result: register });
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

const postLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const login = await myModels.loginUser(email, password);

		res.status(200).json({ ok: true, result: login });
	} catch (error) {
		console.log(error.message);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

export const myControllers = {
	get,
	getUsers,
	postRegister,
	postLogin,
	getUserById,
};
