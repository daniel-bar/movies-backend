import express from 'express';

interface IAuthMiddlewareRequest extends express.Request {
    userId?: string;
}

interface IAdminAuthMiddlewareRequest extends express.Request { }

interface IAuthenticatedRequest extends express.Request {
    readonly userId?: string;
}

interface IRegisterRequest extends express.Request {
    readonly body: Readonly<{
        email: string;
        username: string;
        password: string;
    }>;
}

interface ILoginRequest extends express.Request {
    readonly body: Readonly<{
        email: string;
        password: string;
    }>;
}

interface IAutoLoginRequest extends express.Request { }

interface IEditProfileRequest extends IAuthenticatedRequest {
  readonly body: Readonly<{
    password: string;
    newEmail?: string;
    newPassword?: string;
  }>;
}

export {
    IAuthMiddlewareRequest,
    IAdminAuthMiddlewareRequest,
    IAuthenticatedRequest,
    IRegisterRequest,
    ILoginRequest,
    IAutoLoginRequest,
    IEditProfileRequest,
}