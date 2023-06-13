import { Router } from "express";
import { myControllers } from "../controllers/controller.js";
import { myMdleWare } from "../middleware/validations.js";

const myRouter = Router();

myRouter.get("/", myControllers.get);
myRouter.get("/usuarios", myMdleWare.validtToken, myControllers.getUsers);
myRouter.get(
	"/usuarios/:id",
	myMdleWare.validtToken,
	myControllers.getUserById
);
myRouter.post("/registrarse", myControllers.postRegister);
myRouter.post("/login", myControllers.postLogin);

export default myRouter;
