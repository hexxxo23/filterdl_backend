import Users from "../models/userModels.js";
import dotenv from "dotenv";
import { authSchema } from "../helpers/validation_schemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  //   const { username, email, password, confPassword } = req.body;
  const result = await authSchema.validateAsync(req.body);
  const userName = await Users.findOne({
    where: { username: result.username },
  });
  const emailUser = await Users.findOne({
    where: { email: result.email },
  });
  if (userName) {
    if (result.username == userName.username) {
      return res.status(400).json({ msg: "Username Already used" });
    }
  }

  if (emailUser) {
    if (result.email == emailUser.email) {
      return res.status(400).json({ msg: "email Already used" });
    }
  }

  if (result.password !== result.confPassword) {
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password are not match" });
  }
  const salt = await bcrypt.genSalt();
  const hasPassword = await bcrypt.hash(result.password, salt);
  try {
    await Users.create({
      username: result.username,
      email: result.email,
      password: hasPassword,
    });
    res.json({ msg: "Register is Success" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        username: req.body.username,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      return res.status(404).json({ msg: "Wrong password" });
    }
    const userId = user[0].id;
    const username = user[0].username;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, username, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, username, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure:true
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Username can't founded" });
  }
};
