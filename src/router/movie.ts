import express from "express";
import multer from "multer";

import { bodyKeys } from '../middleware/security';

import { 
  auth,
  adminAuth,
} from "../middleware/auth";

import {
  storage,
  addMovie,
  getMovies,
  getMovie,
  getCategories,
  deleteMovie,
} from "../controller/movie";

const router = express.Router();

router.post(
  "/",
  bodyKeys([
    { key: 'title', type: 'string' },
    { key: 'description', type: 'string' },
    { key: 'category', type: 'string' },
    { key: 'release_date', type: 'number' },
    { key: 'movie_hour_length', type: 'number' },
    { key: 'movie_minute_length', type: 'number' },
  ]),
  auth,
  multer({ storage }).fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
  addMovie
);

router.get("/list", getMovies);

router.get("/categories", getCategories);

router.get("/:id", getMovie);

router.delete('/:id', adminAuth, deleteMovie);

export default router;