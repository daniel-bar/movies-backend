import express from 'express';

import { IServerResponse } from '../../shared/response';

import { MovieCategory } from '../../../server-global';

type IAddMovieResponse = express.Response<IServerResponse>;

type IGetMoviesResponse = express.Response<
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

type IAddFavoriteMoviesResponse = express.Response<IServerResponse>; 

type IDeleteFavoriteMovieResponse = express.Response<IServerResponse>; 

type IGetFavoriteMoviesResponse = express.Response<
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

export {
    IAddMovieResponse,
    IGetMoviesResponse,
    IGetMovieResponse,
    IGetCategoriesResponse,
    IDeleteMovieResponse,
    IAddFavoriteMoviesResponse,
    IDeleteFavoriteMovieResponse,
    IGetFavoriteMoviesResponse,
};