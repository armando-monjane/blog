import express from "express";
import {
  create,
  getById,
  getAll,
  deleteById,
  update,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", getAll);
userRouter.post("/", create);
userRouter.get("/:id", getById);
userRouter.put("/:id", update);
userRouter.delete("/:id", deleteById);

export default userRouter;
