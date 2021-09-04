import express from "express";

import { IServerResponse } from "../../shared/response";

type IRegisterResponse = express.Response<
  IServerResponse & {
    data?: {
      username: string;
      email: string;
      // token: string;
    };
  }
>;

type ILoginResponse = express.Response<
  IServerResponse & {
    data?: {
      username: string;
      email: string;
      token: string;
    };
  }
>;

type IAutoLoginResponse = express.Response<
  IServerResponse & {
    data?: {
      username: string;
      email: string;
    };
  }
>;

export {
  IRegisterResponse,
  ILoginResponse,
  IAutoLoginResponse,
};
