import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import ServerGlobal from "../server-global";

import { User, Token } from '../model/shared/index'

import {
  IRegisterRequest,
  ILoginRequest,
  IAutoLoginRequest,
} from "../model/express/request/auth";
import {
  IRegisterResponse,
  ILoginResponse,
  IAutoLoginResponse,
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
    const newUser: IDBUserAttributes = User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });

    // const userId = User.

    // const userIdc = await User.findOne({ where: { id: req.body.email } });
      
    // // Creating the user document
    // const newToken = jwt.sign({ id: User.id }, process.env.JWT_PWD, {
    //   expiresIn: "7 days",
    // });

    ServerGlobal.getInstance().logger.info(
      `<register>: Successfully registered user with email: ${req.body.email}`
    );

    res.status(201).send({
      success: true,
      message: "Successfully created a new user",
      data: {
        username: req.body.username,
        email: req.body.email,
        // token: newToken,
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

// const login = async (req: ILoginRequest, res: ILoginResponse) => {
//   ServerGlobal.getInstance().logger.info(
//     `<login>: Start processing request with email: ${req.body.email}`
//   );

//   // Find matching user by email address
//   try {
//     const matchingUser = await User.findOne({ where: { email: req.body.email } });
//     const userByEmail = await User.findOne({ 
//       where: { email: req.body.email, password: req.body.password } 
//     });

//     // There is no such user with the provided email
//     if (!userByEmail) {
//       ServerGlobal.getInstance().logger.error(
//         `<login>: Failed to login because the email ${req.body.email} does not match any user`
//       );

//       res.status(400).send({
//         success: false,
//         message: "Authentication failed",
//       });
//       return;
//     }

//     const compareResult = await bcrypt.compare(
//       req.body.password,
//       userByEmail.password
//     );

//     // Check whether the provided password is as same as the stored hashed one
//     if (!compareResult) {
//       ServerGlobal.getInstance().logger.error(
//         `<login>: Failed to login because the password does not match the hashed password \
// with email ${req.body.email}`
//       );

//       res.status(400).send({
//         success: false,
//         message: "Authentication failed",
//       });
//       return;
//     }

//     // Create new token to insert
//     const newToken = jwt.sign({ id: userByEmail.id }, process.env.JWT_PWD, {
//       expiresIn: "7 days",
//     });

//     if (userByEmail.tokens.length === 5) {
//       userByEmail.tokens.pop();
//     }

//     userByEmail.tokens = [{ token: newToken }, ...userByEmail.tokens];

//     // Saving the user document in DB
//     await userByEmail.save();

//     ServerGlobal.getInstance().logger.info(
//       `<login>: Successfully logged user in \
// with email: ${req.body.email} to user id: ${userByEmail.id}`
//     );

//     res.status(200).send({
//       success: true,
//       message: "Successfully authenticated",
//       data: {
//         username: userByEmail.username,
//         email: req.body.email,
//         token: newToken,
//       },
//     });
//     return;
//   } catch (e) {
//     ServerGlobal.getInstance().logger.error(
//       `<register>: Failed to login with email ${req.body.email} because of server error: ${e}`
//     );

//     res.status(500).send({
//       success: false,
//       message: "Server error",
//     });
//     return;
//   }
// };

// const autoLogin = async (req: IAutoLoginRequest, res: IAutoLoginResponse) => {
//   ServerGlobal.getInstance().logger.info(
//     "<autoLogin>: Start processing request"
//   );

//   interface IVerify {
//     readonly id: string;
//     readonly iat: number;
//     readonly exp: number;
//   }

//   let user: Pick<IUserDocument, "username" | "email"> | null;
//   let userId: string;

//   // Authorizing the user
//   try {
//     const token: string = (req.header("Authorization") as string).replace(
//       "Bearer ",
//       ""
//     );
//     const data: IVerify = jwt.verify(token, process.env.JWT_PWD) as IVerify;

//     user = await UserDB.findById(data.id, { username: 1, email: 1 });

//     if (!user) {
//       ServerGlobal.getInstance().logger.error(
//         `<autoLogin>: Failed to auto login with user id of ${data.id}`
//       );

//       res.status(401).send({
//         success: false,
//         message: "Unable to auto login",
//       });
//       return;
//     }

//     userId = data.id;
//   } catch (e) {
//     ServerGlobal.getInstance().logger.error(
//       `<autoLogin>: Failed to auto login because of login error: ${e}`
//     );

//     res.status(401).send({
//       success: false,
//       message: "Unable to auto login",
//     });
//     return;
//   }

//   ServerGlobal.getInstance().logger.info(
//     `<autoLogin>: Successfully auto login user with id ${userId}`
//   );

//   res.status(200).send({
//     success: true,
//     message: "Successful auto login",
//     data: {
//       username: user.username,
//       email: user.email,
//     },
//   });
//   return;
// };

export { 
  register,
  // login,
  // autoLogin 
};
