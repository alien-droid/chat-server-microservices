import { Request, Response, NextFunction } from "express";
import { ApiError, encryptPassword, isPasswordMatch } from "../utils";
import User, { IUser } from "../database/models/UserModel";
import jwt from "jsonwebtoken";
import config from "../config/config";

const jwtSecret = config.JWT_SECRET as string;
// cookie options
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
const expirationDate = new Date(
  Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);
const cookieOptions = {
  expires: expirationDate,
  secure: false,
  httpOnly: true,
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await isPasswordMatch(password, user.password as string))) {
      throw new ApiError(400, "Incorrect email or password");
    }
    const token = createToken(user, res);
    res.json({
      token,
      message: "Login successful",
      status: 200,
    });
  } catch (error: any) {
    next(error);
  }
};

const createToken = (user: IUser, res: Response): string => {
  const { name, email, id } = user;
  const token = jwt.sign({ name, email, id }, jwtSecret, {
    expiresIn: "1d",
  });
  if (config.env === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  return token;
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError(400, "User already exists");
    }

    const newUser = await User.create({
      name,
      email,
      password: await encryptPassword(password),
    });
    const user_data = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    };
    res.status(201).json({
      data: user_data,
      message: "User created successfully",
      status: 201,
    });
  } catch (error: any) {
    next(error);
  }
};