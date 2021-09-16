import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import ServerGlobal from "../server-global";

import { UserModel } from "../model/user";
import { User, Token } from '../model/shared/index';

import {
  IRegisterRequest,
  ILoginRequest,
  IAutoLoginRequest,
  IEditProfileRequest,
} from "../model/express/request/auth";
import {
  IRegisterResponse,
  ILoginResponse,
  IAutoLoginResponse,
  IEditProfileResponse,
} from "../model/express/response/auth";

const register = async (req: IRegisterRequest, res: IRegisterResponse) => {
  ServerGlobal.getInstance().logger.info(
    `<register>: Start processing request with email: ${req.body.email}`
  );

  // Validate client provided username of valid length
  if (req.body.username.length < 3 || req.body.username.length > 26) {
    ServerGlobal.getInstance().logger.error(
      `<register>: Failed to register since provided invalid username with email ${req.body.email}`
    );

    res.status(400).send({
      success: false,
      message: "Please provide valid username",
    });
    return;
  }

  // Validate client provided valid email
  const isEmailValid =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
      req.body.email
    );

  if (!isEmailValid) {
    ServerGlobal.getInstance().logger.error(
      `<register>: Failed to register since provided invalid email ${req.body.email}`
    );

    res.status(400).send({
      success: false,
      message: "Please provide valid email",
    });
    return;
  }

  // Validate client provided password of valid length
  if (req.body.password.length < 7 || req.body.password.length > 24) {
    ServerGlobal.getInstance().logger.error(
      `<register>: Failed to register since provided invalid password with email ${req.body.email}`
    );

    res.status(400).send({
      success: false,
      message: "Please provide valid password",
    });
    return;
  }

  try {
    // Find a document with the provided email
    const matchingUser = await User.findOne({ where: { email: req.body.email } });

    if (matchingUser) {
      ServerGlobal.getInstance().logger.error(
        `<register>: Failed to register because provided email ${req.body.email} is already exist`
      );

      res.status(400).send({
        success: false,
        message: "Registration failed - provided email is already exist",
      });
      return;
    }

    // From now on, the client is allowed to register
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    
    // Saving the user document in DB
    const newUser = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });
      
    // // Creating the user document
    const newToken = jwt.sign({ id: newUser.id }, process.env.JWT_PWD, {
      expiresIn: "7 days",
    });

    await Token.create({
      token: newToken,
      user_id: newUser.id
    });

    ServerGlobal.getInstance().logger.info(
      `<register>: Successfully registered user with ID: ${newUser.id}`
    );

    res.status(201).send({
      success: true,
      message: "Successfully created a new user",
      data: {
        username: req.body.username,
        email: req.body.email,
        token: newToken,
      },
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<register>: Failed to register because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

const login = async (req: ILoginRequest, res: ILoginResponse) => {
  ServerGlobal.getInstance().logger.info(
    `<login>: Start processing request with email: ${req.body.email}`
  );

  try {
    // Find matching user by email address
    const userByEmail = await User.findOne({ where: { email: req.body.email } });

    // There is no such user with the provided email
    if (!userByEmail) {
      ServerGlobal.getInstance().logger.error(
        `<login>: Failed to login because the email ${req.body.email} does not match any user`
      );

      res.status(400).send({
        success: false,
        message: "Authentication failed",
      });
      return;
    }

    const compareResult = await bcrypt.compare(
      req.body.password,
      userByEmail.password,
    );

    // Check whether the provided password is as same as the stored hashed one
    if (!compareResult) {
      ServerGlobal.getInstance().logger.error(
        `<login>: Failed to login because the password does not match the hashed password \
with email ${req.body.email}`
      );

      res.status(400).send({
        success: false,
        message: "Authentication failed",
      });
      return;
    }

    // Finding user token 
    const tokenByUserId = await Token.findOne({ where: { user_id: userByEmail.id } });

    // Create new token to insert
    let newToken = jwt.sign({ id: userByEmail.id }, process.env.JWT_PWD, {
      expiresIn: "7 days",
    });

    newToken = tokenByUserId?.token!

    if (tokenByUserId === null) {
      ServerGlobal.getInstance().logger.error(
        `<login>: Failed to login because token is null`
      );

      res.status(400).send({
        success: false,
        message: "Token error",
      });
      return;
    }
    
    // Saving the token document in DB
    await tokenByUserId.save();

    ServerGlobal.getInstance().logger.info(
      `<login>: Successfully logged user in \
with email: ${req.body.email} to user id: ${userByEmail.id}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully authenticated",
      data: {
        username: userByEmail.username,
        email: req.body.email,
        token: newToken,
      },
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<register>: Failed to login with email ${req.body.email} because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

const autoLogin = async (req: IAutoLoginRequest, res: IAutoLoginResponse) => {
  ServerGlobal.getInstance().logger.info(
    "<autoLogin>: Start processing request"
  );

  interface IVerify {
    readonly id: string;
    readonly iat: number;
    readonly exp: number;
  }

  let user: Pick<UserModel, 'email' | 'username'> | null;
  let user_id: string;

  // Authorizing the user
  try {
    const token: string = (req.header("Authorization") as string).replace(
      "Bearer ",
      ""
    );

    const data: IVerify = jwt.verify(token, process.env.JWT_PWD) as IVerify;

    user = await User.findByPk(data.id);

    if (!user) {
      ServerGlobal.getInstance().logger.error(
        `<autoLogin>: Failed to auto login with user id of ${data.id}`
      );

      res.status(401).send({
        success: false,
        message: "Unable to auto login",
      });
      return;
    }

    user_id = data.id;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<autoLogin>: Failed to auto login because of login error: ${e}`
    );

    res.status(401).send({
      success: false,
      message: "Unable to auto login",
    });
    return;
  }

  ServerGlobal.getInstance().logger.info(
    `<autoLogin>: Successfully auto login user with id ${user_id}`
  );

  res.status(200).send({
    success: true,
    message: "Successful auto login",
    data: {
      username: user.username,
      email: user.email,
    },
  });
  return;
};

const editProfile = async (req: IEditProfileRequest, res: IEditProfileResponse) => {
  ServerGlobal.getInstance().logger.info(
    `<editProfile>: Start processing request with user id ${req.user_id}`
  );

  // Check whether provided fields are valid
  if (
    (req.body.newPassword!.length < 7 && req.body.newPassword!.length > 0) ||
    req.body.newPassword!.length > 24
  ) {
    res.status(400).send({
      success: false,
      message: "Invalid form fields",
    });
    return;
  }

  try {
    // Find the user
    const userByID = await User.findByPk(req.user_id);

    if (!userByID) {
      ServerGlobal.getInstance().logger.error(
        `<editProfile>: Failed to get user details for user id ${req.user_id}`
      );

      res.status(401).send({
        success: false,
        message: "Could not find user",
      });
      return;
    }

    // Check whether provided current password is correct
    const compareResult = await bcrypt.compare(
      req.body.password,
      userByID.password
    );

    if (!compareResult) {
      ServerGlobal.getInstance().logger.error(
        `<editProfile>: Failed to edit profile because \
provided password mismatches for user id ${req.user_id}`
      );

      res.status(400).send({
        success: false,
        message: "Mismatch password",
      });
      return;
    }

    // Update user's email if client wants to
    if (req.body.newEmail !== "") {
      (userByID.email as string) === req.body.newEmail;
    }

    // Update user's password if client wants to
    if (req.body.newPassword !== "") {
      const hashedNewPassword = await bcrypt.hash(req.body.newPassword!, 8);

      userByID.password = hashedNewPassword;
    }

    await userByID.save();

    ServerGlobal.getInstance().logger.info(
      `<editProfile>: Successfully edited user profile with id ${req.user_id}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully edited user details",
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<editProfile>: Failed to edit profile because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

export { 
  register,
  login,
  autoLogin,
  editProfile,
}
