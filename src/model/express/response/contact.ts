import express from 'express';

import { IServerResponse } from '../../shared/response';

import { Topic } from '../../shared/enumerations';

type IContantResponse = express.Response<IServerResponse>;

type IGetTopicsResponse = express.Response<
    IServerResponse & {
        data?: {
            value: Topic,
            label: string,
        }[];
    }
>;

export {
    IContantResponse,
    IGetTopicsResponse,
};