import express from "express";

import { IAuthenticatedRequest } from "./auth";

import { MovieCategory } from '../../../server-global';

interface IAddMovieRequest extends express.Request {
  readonly body: Readonly<{
    title: string;
    description: string;
    category: MovieCategory;
    release_date: number;
    movie_hour_length: number;
    movie_minute_length: number;
  }>;
}

interface IgetMoviesRequest extends express.Request {
  readonly query: Readonly<{
    category?: string;
  }>;
}

interface IGetMovieRequest extends express.Request {
  readonly params: Readonly<{ id: string }>;
}

interface IGetCategoriesRequest extends express.Request {}

interface IDeleteMovieRequest extends express.Request {
  readonly params: Readonly<{ id: string }>;
}

interface IAddFavoriteMoviesRequest extends IAuthenticatedRequest {
  readonly params: Readonly<{ id: string }>;
}

interface IDeleteFavoriteMovieRequest extends express.Request {
  readonly params: Readonly<{ id: string }>;
}


export {
  IAddMovieRequest,
  IgetMoviesRequest,
  IGetMovieRequest,
  IGetCategoriesRequest,
  IDeleteMovieRequest,
  IAddFavoriteMoviesRequest,
  IDeleteFavoriteMovieRequest,
}
