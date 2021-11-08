import express from 'express';

import { IServerResponse } from '../../shared/response';

import { Category } from '../../../model/shared/enumerations';

type IAddMovieResponse = express.Response<IServerResponse>;

type IGetMoviesResponse = express.Response<
    IServerResponse & {
        data?: {
            id: number;
            title: string;
            description: string;
            category: Category;
            release_date: number;
            movie_hour_length: number;
            movie_minute_length: number;
            image_path: string;
            video_path: string;
            like_count: number;
        }[];
    }
>;

type IGetMovieResponse = express.Response<
    IServerResponse & {
        data?: {
            id: number;
            title: string;
            description: string;
            category: Category;
            release_date: number;
            movie_hour_length: number;
            movie_minute_length: number;
            image_path: string;
            video_path: string;
            like_count: number;
        };
    }
>;

type IDeleteMovieResponse = express.Response<IServerResponse>; 

type IGetCategoriesResponse = express.Response<
    IServerResponse & {
        data?: {
            value: Category
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
            category: Category;
            release_date: number;
            movie_hour_length: number;
            movie_minute_length: number;
            image_path: string;
            video_path: string;
            like_count: number;
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