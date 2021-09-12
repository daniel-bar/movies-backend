import path from "path";
import mime from "mime-types";
import multer from "multer";

import ServerGlobal from "../server-global";

import { Movie } from "../model/shared/index";

import {
  IAddMovieRequest,
  IgetMoviesRequest,
  IGetMovieRequest,
  IGetCategoriesRequest,
  IDeleteMovieRequest,
} from "../model/express/request/movie";
import {
  IAddMovieResponse,
  IgetMoviesResponse,
  IGetMovieResponse,
  IGetCategoriesResponse,
  IDeleteMovieResponse,
} from "../model/express/response/movie";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './data');
  },
  filename: (req, file, cb) => {
    const ext = mime.extension(file.mimetype);
    const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    cb(null, `${Date.now()}-${random}.${ext}`);
  },
});

const addMovie = async (req: IAddMovieRequest, res: IAddMovieResponse) => {
  ServerGlobal.getInstance().logger.info("<addMovie>: Start processing request");

  try {
    // Validate provided fields of valid length
    if (
      req.body.title.length < 3 ||
      req.body.title.length > 26 ||
      req.body.description.length < 3 ||
      req.body.description.length > 280
    ) {
      ServerGlobal.getInstance().logger.error(
        "<addMovie>: Failed to add movie because invalid fields length"
      );

      res.status(400).send({
        success: false,
        message: "Please provide valid length of movie fields",
      });
      return;
    }

    // Validate provided movie hour, minute and release date
    if (
      isNaN(req.body.movie_hour_length ||
            req.body.movie_minute_length ||
            req.body.release_date)
    ) {
      ServerGlobal.getInstance().logger.error(
        "<addMovie>: Failed to add product because invalid hour, minute or release date"
      );

      res.status(400).send({
        success: false,
        message: "Please provide valid hour, minute or release date",
      });
      return;
    }

    // Validate provided category
    if (
      isNaN(+req.body.category) ||
      !ServerGlobal.getInstance().isValidCategoryValue(+req.body.category)
    ) {
      ServerGlobal.getInstance().logger.error(
        "<addMovie>: Failed to add movie because invalid category"
      );

      res.status(400).send({
        success: false,
        message: "Please provide valid category",
      });
      return;
    }

    const url = req.protocol + "://" + req.get("host");
    
    // Creating the movie
    const newMovie = await Movie.create({
      title: req.body.title,
      description: req.body.description,
      category: +req.body.category,
      release_date: req.body.release_date,
      movie_hour_length: req.body.movie_hour_length,
      movie_minute_length: req.body.movie_minute_length,
      image_path: url + '/image/' + (req as any).files.image[0].filename,
      video_path: url + '/video/' + (req as any).files.video[0].filename,
    });

    // Saving the movie in DB
    await newMovie.save();

    ServerGlobal.getInstance().logger.info(
      `<addMovie>: Successfully added movie with id: ${newMovie.id}`
    );

    res.status(201).send({
      success: true,
      message: "Successfully created a new movie",
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<addMovie>: Failed to add movie because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

const getMovies = async (req: IgetMoviesRequest, res: IgetMoviesResponse) => {
  ServerGlobal.getInstance().logger.info(`<getMovies>: Start processing request`);

  console.log(req.query.category)
  try {
    let queryObj: Object = {};

    if (typeof req.query.category !== 'undefined') {   
      queryObj = { where: { category: req.query.category } };
    }

    const movies = await Movie.findAll(queryObj);

    ServerGlobal.getInstance().logger.info(`<getMovies>: Successfully got the movies`);

    res.status(200).send({
      success: true,
      message: "Successfully retrieved movies",
      data: movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        description: movie.description,
        category: movie.category,
        release_date: movie.release_date,
        movie_hour_length: movie.movie_hour_length,
        movie_minute_length: movie.movie_minute_length,
        image_path: movie.image_path,
        video_path: movie.video_path,
      })),
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<getMovies>: Failed to get movies because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

const getMovie = async (req: IGetMovieRequest, res: IGetMovieResponse) => {
  ServerGlobal.getInstance().logger.info(
    `<getMovie>: Start processing request with movie Id ${req.params.id}`
  );

  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      ServerGlobal.getInstance().logger.error(
        `<getMovie>: Failed to find movie with id ${req.params.id}`
      );

      res.status(400).send({
        success: false,
        message: "Could not find movie",
      });
      return;
    }

    ServerGlobal.getInstance().logger.info(
      `<getMovie>: Successfully got movie with id ${req.params.id}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully retrieved movie",
      data: {
        id: movie.id,
        title: movie.title,
        description: movie.description,
        category: movie.category,
        release_date: movie.release_date,
        movie_hour_length: movie.movie_hour_length,
        movie_minute_length: movie.movie_minute_length,
        image_path: movie.image_path,
        video_path: movie.video_path,
      },
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<getMovie>: Failed to get movie with id ${req.params.id} because of server error: ${e}`
      );
      
      res.status(500).send({
        success: false,
        message: "Server error",
      });
      return;
    }
  };
  
const getCategories = async (req: IGetCategoriesRequest, res: IGetCategoriesResponse) => {
  ServerGlobal.getInstance().logger.info(
    "<getCategories>: Start processing request"
  );

  ServerGlobal.getInstance().logger.info(
    "<getCategories>: Successfully processed request"
  );

  res.status(200).send({
    success: true,
    message: "Successfully retrieved categories",
    data: ServerGlobal.getInstance().movieCategories,
  });
  return;
};

const deleteMovie = async (req: IDeleteMovieRequest, res: IDeleteMovieResponse) => {
  ServerGlobal.getInstance().logger.info(
    `<deleteMovie>: Start processing request with movie id ${req.params.id}`
  );

  try {
    const movieId = await Movie.findByPk(req.params.id);

    if (!movieId) {
      ServerGlobal.getInstance().logger.error(
        `<deleteMovie>: Failed to find movie with id ${req.params.id}`
      );

      res.status(400).send({
        success: false,
        message: "Could not find movie",
      });
      return;
    }

    await movieId.destroy();

    ServerGlobal.getInstance().logger.info(
      `<deleteMovie>: Successfully deleted movie with ${req.params.id}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully deleted movie",
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<deleteMovie>: Failed to delete movie with id: ${req.params.id}. because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

export {
  storage,
  addMovie,
  getMovies,
  getMovie,
  getCategories,
  deleteMovie,
}