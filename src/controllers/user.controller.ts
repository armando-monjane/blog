import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import * as yup from "yup";
import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../repositories/user.repository";
import {
  createUserValidation,
  getUserByIdValidation,
} from "../validations/user.validation";
import { CreateUser } from "../models/create-user";

const create: RequestHandler<unknown, unknown, CreateUser, unknown> = async (
  req,
  res,
) => {
  try {
    await createUserValidation.validate(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await createUser(req.body);
    res.status(201).send(user);
  } catch (err: any) {
    if (err instanceof yup.ValidationError) {
      res.status(400).send({ message: err?.message });
      return;
    }

    res.status(500).send({ message: err?.message });
  }
};

const getById: RequestHandler = async (req, res) => {
  try {
    await getUserByIdValidation.validate(req.params);

    const user = await getUserById(Number(req.params.id));
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.status(200).send(user);
  } catch (err: any) {
    if (err instanceof yup.ValidationError) {
      res.status(400).send({ message: err?.message });
      return;
    }

    res.status(500).send({ message: err?.message });
  }
};

const getByEmail: RequestHandler = async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    res.status(200).send(user);
  } catch (err: any) {
    res.status(500).send({ message: err?.message });
  }
};

const update: RequestHandler = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const userToUpdate = await getUserById(userId);
    if (!userToUpdate) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const user = await updateUser(userId, req.body);
    res.status(200).send(user);
  } catch (err: any) {
    res.status(500).send({ message: err?.message });
  }
};

const deleteById: RequestHandler = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const userDelete = await getUserById(userId);
    if (!userDelete) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    await deleteUser(userId);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).send({ message: err?.message });
  }
};

const getAll: RequestHandler = async (_req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).send(users);
  } catch (err: any) {
    res.status(500).send({ message: err?.message });
  }
};

const changePassword: RequestHandler = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await getUserById(userId);
    const match =
      user && (await bcrypt.compare(req.body.oldPassword, user.password));
    if (!match) {
      res.status(400).send({ message: "Invalid password" });
      return;
    }
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);
    await updateUser(userId, { ...user, password: newPassword });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).send({ message: err?.message });
  }
};

export {
  create,
  getById,
  getByEmail,
  update,
  deleteById,
  getAll,
  changePassword,
};
