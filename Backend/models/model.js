import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/connection.js";

const getUsers = async () => {
	const queryUsers = "SELECT id, email, password, rol, lenguage FROM usuarios";

	try {
		const { rows } = await pool.query(queryUsers);
		return rows;
	} catch (error) {
		throw error;
	}
};

const getUserById = async (id) => {
	const queryUser =
		"SELECT id, email, rol, lenguage FROM usuarios WHERE id = $1";
	try {
		if (!id) {
			throw { code: "404" };
		}
		const { rows } = await pool.query(queryUser, [id]);
		return rows[0];
	} catch (error) {
		throw error;
	}
};
const registerNewUser = async (email, password, rol, lenguage) => {
	const queryRegister =
		"INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *";

	try {
		if (!email || !password || !rol || !lenguage) {
			throw { code: "400" };
		}

		const hashPassword = await bcrypt.hash(password, 10);

		const newUser = [email, hashPassword, rol, lenguage];

		const { rows } = await pool.query(queryRegister, newUser);

		const user = rows.map((row) => {
			return {
				email: row.email,
				password: row.password,
				rol: row.rol,
				lenguage: row.lenguage,
			};
		});
		return user;
	} catch (error) {
		throw error;
	}
};

const loginUser = async (email, password) => {
	try {
		const emailExistQuery =
			"SELECT id, email, password FROM usuarios WHERE email = $1";

		if (!email || !password) {
			throw {
				code: "400",
			};
		}

		// VALIDATION EMAIL
		const {
			rows: [userDB],
			rowCount,
		} = await pool.query(emailExistQuery, [email]);

		if (!rowCount) {
			throw { code: "404", message: "Este correo no se encuentra registrado" };
		}

		// VALIDATION PASSWORD
		const verifyPassword = await bcrypt.compare(password, userDB.password);
		if (!verifyPassword) {
			throw { code: "404", message: "Contraseña incorrecta" };
		}

		const token = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY, {
			expiresIn: "1h",
		});

		const userId = userDB.id;
		const userLogin = { userId, email, token };
		return userLogin;
	} catch (error) {
		throw error;
	}
};

export const myModels = {
	getUsers,
	registerNewUser,
	loginUser,
	getUserById,
};
