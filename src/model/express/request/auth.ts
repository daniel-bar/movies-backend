import express from 'express';

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

export {
    IAuthenticatedRequest,
    IRegisterRequest,
    ILoginRequest,
    IAutoLoginRequest,
}