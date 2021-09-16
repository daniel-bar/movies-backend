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
  addFavoriteMovie,
  deleteFavoriteMovie,
  getFavoriteMovies,
} from "../controller/movie";

const router = express.Router();

router.post(
  "/",
  auth,
  multer({ storage }).fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
  addMovie,
);

router.get("/list", getMovies);

router.get("/categories", getCategories);

router.get("/:id", getMovie);

router.delete(
  '/:id',
  adminAuth,
  deleteMovie,
);
  
router.get(
  "/favorite/:id", 
  auth, 
  addFavoriteMovie,
);

router.delete(
  '/favorite/:id',
  auth,
  deleteFavoriteMovie,
);

router.get(
  '/favoriteMovies',
  auth,
  getFavoriteMovies,
)
  
export default router;