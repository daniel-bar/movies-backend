import express from 'express';

import { IServerResponse } from '../../shared/response';

import { MovieCategory } from '../../../server-global';

type IAddMovieResponse = express.Response<IServerResponse>;

type IgetMoviesResponse = express.Response<
    IServerResponse & {
        data?: {
            id: number;
            title: string;
            description: string;
            category: MovieCategory;
            release_date: number;
            movie_hour_length: number;
            movie_minute_length: number;
            image_path: string;
            video_path: string;
        }[];
    }
>;

type IGetMovieResponse = express.Response<
    IServerResponse & {
        data?: {
            id: number;
            title: string;
            description: string;
            category: MovieCategory;
            release_date: number;
            movie_hour_length: number;
            movie_minute_length: number;
            image_path: string;
            video_path: string;
        };
    }
>;

type IDeleteMovieResponse = express.Response<IServerResponse>; 

type IGetCategoriesResponse = express.Response<
    IServerResponse & {
        data?: {
            value: MovieCategory
        }[];
    }
>;


export {
    IAddMovieResponse,
    IgetMoviesResponse,
    IGetMovieResponse,
    IGetCategoriesResponse,
    IDeleteMovieResponse,
};