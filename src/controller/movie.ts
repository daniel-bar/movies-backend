import path from "path";
import mime from "mime-types";
import multer from "multer";

import ServerGlobal from "../server-global";

import { Movie, FavoriteMovies } from "../model/shared/index";

import {
  IAddMovieRequest,
  IgetMoviesRequest,
  IGetMovieRequest,
  IGetCategoriesRequest,
  IDeleteMovieRequest,
  IAddFavoriteMoviesRequest,
  IDeleteFavoriteMovieRequest,
} from "../model/express/request/movie";
import {
  IAddMovieResponse,
  IgetMoviesResponse,
  IGetMovieResponse,
  IGetCategoriesResponse,
  IDeleteMovieResponse,
  IAddFavoriteMoviesResponse,
  IDeleteFavoriteMovieResponse,
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

  try {
    let queryObj: Object = {};

    if (typeof req.query.category !== 'undefined') {   
      queryObj = { where: { category: req.query.category } };
    }

    // Get movies
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
    // Get movie
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
    // Get movie
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

const addFavoriteMovie = async (req: IAddFavoriteMoviesRequest, res: IAddFavoriteMoviesResponse) => {
  ServerGlobal.getInstance().logger.info("<addFavoriteMovie>: Start processing request");

  try {
    // Validate provided user ID existence
    if (!req.userId) {
      ServerGlobal.getInstance().logger.error(
        `<addFavoriteMovie>: Failed to find user with id ${req.userId}`
      );

      res.status(400).send({
        success: false,
        message: "Could not find user",
      });
      return;
    }
    
    // Get movie by ID
    const movieId = await Movie.findByPk(req.params.id);

    // Validate provided movie ID existence
    if (!movieId) {
      ServerGlobal.getInstance().logger.error(
        `<addFavoriteMovie>: Failed to find movie with id ${req.params.id}`
      );

      res.status(400).send({
        success: false,
        message: "Could not find movie",
      });
      return;
    }

    // Validate provided movie ID with favorite movies DB table for double prevention
    const favoriteMovieId = await FavoriteMovies.findOne({ where: { movie_id: req.params.id } });

    if (typeof favoriteMovieId?.movie_id === 'undefined') {
      // Creating the favorite movie
      const newFavoriteMovie = await FavoriteMovies.create({
        movie_id: +req.params.id,
        userId: +req.userId,
      });

      // Saving the favorite movie in DB
      await newFavoriteMovie.save();

      ServerGlobal.getInstance().logger.info(
        `<addFavoriteMovie>: Successfully added favorite movie row with id: ${newFavoriteMovie.id}`
      );

      res.status(201).send({
        success: true,
        message: `Successfully created a new favorite movie row for user ID: ${req.userId}`,
      });
      return;
    } else {
      ServerGlobal.getInstance().logger.error(
        `<addFavoriteMovie>: The movie is already in user favorite movies. movie id ${req.params.id}`
      );

      res.status(400).send({
        success: false,
        message: "The movie is already in user favorite movies",
      });
      return;
    }
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<addFavoriteMovie>: Failed to add favorite movie because of server error: ${e}`
    );

    res.status(500).send({
      success: false,
      message: "Server error",
    });
    return;
  }
};

const deleteFavoriteMovie = async (req: IDeleteFavoriteMovieRequest, res: IDeleteFavoriteMovieResponse) => {
  ServerGlobal.getInstance().logger.info(
    `<deleteFavoriteMovie>: Start processing request with favorite movie id ${req.params.id}`
  );

  try {
    // Get favorite movie
    const favoriteMovieId = await FavoriteMovies.findByPk(req.params.id);

    if (!favoriteMovieId) {
      ServerGlobal.getInstance().logger.error(
        `<deleteFavoriteMovie>: Failed to find favorite movie with id ${req.params.id}`
      );

      res.status(400).send({
        success: false,
        message: "Could not find favorite movie",
      });
      return;
    }

    await favoriteMovieId.destroy();

    ServerGlobal.getInstance().logger.info(
      `<deleteFavoriteMovie>: Successfully deleted favorite movie with ${req.params.id}`
    );

    res.status(200).send({
      success: true,
      message: "Successfully deleted favorite movie",
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<deleteFavoriteMovie>: Failed to delete favorite movie with id: ${req.params.id}. because of server error: ${e}`
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
  addFavoriteMovie,
  deleteFavoriteMovie,
}