import path from "path";
import mime from "mime-types";
import multer from "multer";

import ServerGlobal from "../server-global";

import Movie from '../model/movie';
import User from '../model/user';
import FavoriteMovies from '../model/favoriteMovies';


import {
  IAddMovieRequest,
  IGetMoviesRequest,
  IGetMovieRequest,
  IGetCategoriesRequest,
  IDeleteMovieRequest,
  IAddFavoriteMoviesRequest,
  IDeleteFavoriteMovieRequest,
  IGetFavoriteMoviesRequest,
} from "../model/express/request/movie";
import {
  IAddMovieResponse,
  IGetMoviesResponse,
  IGetMovieResponse,
  IGetCategoriesResponse,
  IDeleteMovieResponse,
  IAddFavoriteMoviesResponse,
  IDeleteFavoriteMovieResponse,
  IGetFavoriteMoviesResponse,
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
      like_count: req.body.like_count,
      image_path: url + '/image/' + (req as any).files.image[0].filename,
      video_path: url + '/video/' + (req as any).files.video[0].filename,
      user_id: +req.user_id!,
    });

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

const getMovies = async (req: IGetMoviesRequest, res: IGetMoviesResponse) => {
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
        like_count: movie.like_count,
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
        like_count: movie.like_count,
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
    // Get movie by ID
    const movieById = await Movie.findByPk(req.params.id);

    // Validate movie existence
    if (!movieById) {
      ServerGlobal.getInstance().logger.error(
        `<deleteMovie>: Failed to find movie with id ${req.params.id}`
      );

      res.status(400).send({
        success: false,
        message: "Could not find movie",
      });
      return;
    }

    // Checking if user uploaded the video
    if (movieById.user_id !== +req.user_id!) {
      ServerGlobal.getInstance().logger.error(
        `<deleteMovie>: The logged in user with ID: ${req.user_id} is not authorized to delete movie with ID: ${req.params.id}`
      );

      res.status(401).send({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    // Get user by ID
    const userById = await User.findByPk(movieById.user_id);

    // Validate provided user existence
    if (!userById) {
      ServerGlobal.getInstance().logger.error(
        `<addFavoriteMovie>: Failed to find user with id ${movieById.user_id}`
      );
        
      res.status(400).send({
        success: false,
        message: "Could not find user",
      });
      return;
    }

    // Decrement 1 like to user like count and saving user DB model
    userById.like_count--;
    await userById.save();

    // Deleting the movie
    await movieById.destroy();

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
    // Get movie by ID and finding favorite movie
    const [movieById, favoriteMovie] = await Promise.all([
      Movie.findByPk(req.params.id),
      FavoriteMovies.findOne({ where: { user_id: req.user_id, movie_id: req.params.id }}),
    ]);

    // Validate provided user ID existence
    if (!req.user_id) {
      ServerGlobal.getInstance().logger.error(
        `<addFavoriteMovie>: Failed to find user with id ${req.user_id}`
      );

      res.status(400).send({
        success: false,
        message: "Could not find user",
      });
      return;
    }
    
    // Validate provided movie ID existence
    if (!movieById) {
      ServerGlobal.getInstance().logger.error(
        `<addFavoriteMovie>: Failed to find movie with id ${req.params.id}`
      );
        
      res.status(400).send({
        success: false,
        message: "Could not find movie",
      });
      return;
    }

    // Get user by ID
    const userById = await User.findByPk(movieById.user_id);

    // Validate provided user existence
    if (!userById) {
      ServerGlobal.getInstance().logger.error(
        `<addFavoriteMovie>: Failed to find user with id ${movieById.user_id}`
      );
        
      res.status(400).send({
        success: false,
        message: "Could not find user",
      });
      return;
    }
    
    // Validate provided movie ID and user ID with favorite movies DB table for double prevention
    if (favoriteMovie == null) {
      // Creating the favorite movie
      const newFavoriteMovie = await FavoriteMovies.create({
        movie_id: +req.params.id,
        user_id: +req.user_id,
      });

      // Incrementing 1 like to movie like count and saving movie DB model
      movieById.like_count++;
      await movieById.save();

      // Incrementing 1 like to user like count and saving user DB model
      userById.like_count++;
      await userById.save();

      ServerGlobal.getInstance().logger.info(
        `<addFavoriteMovie>: Successfully added favorite movie row with id: ${newFavoriteMovie.id}`
      );

      res.status(201).send({
        success: true,
        message: `Successfully created a new favorite movie row for user ID: ${req.user_id}`,
      });
      return;
    }

    ServerGlobal.getInstance().logger.error(
      `<addFavoriteMovie>: Movie with ID: ${req.params.id} is already in favorites for user ID: ${req.user_id}`
    );

    res.status(400).send({
      success: false,
      message: "Movie is already in favorites",
    });
    return;
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
    // Get favorite movie by ID
    const favoriteMovieId = await FavoriteMovies.findOne({ where: { user_id: req.user_id, movie_id: req.params.id } });

    // Validate provided favorite user ID existence
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

    // Get movie by ID
    const movieById = await Movie.findByPk(req.params.id);

    // Validate provided movie ID existence
    if (!movieById) {
      ServerGlobal.getInstance().logger.error(
        `<addFavoriteMovie>: Failed to find movie with id ${req.params.id}`
      );

      res.status(400).send({
        success: false,
        message: "Could not find movie",
      });
      return;
    }

    // Get user by ID
    const userById = await User.findByPk(movieById.user_id);

    // Validate provided user ID existence
    if (!userById) {
      ServerGlobal.getInstance().logger.error(
        `<addFavoriteMovie>: Failed to find user with id ${movieById.user_id}`
      );
        
      res.status(400).send({
        success: false,
        message: "Could not find user",
      });
      return;
    }

    // Decrement 1 like to movie like count and saving movie DB model
    movieById.like_count--;
    await movieById.save();

    // Decrement 1 like to user like count and saving user DB model
    userById.like_count--;
    await userById.save();

    // Deleting favorite movie
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

const getFavoriteMovies = async (req: IGetFavoriteMoviesRequest, res: IGetFavoriteMoviesResponse) => {
  ServerGlobal.getInstance().logger.info(`<getFavoriteMovies>: Start processing request`);

  try {
    if (!req.user_id) {
      ServerGlobal.getInstance().logger.error(
        `<getFavoriteMovies>: Failed to find user with id ${req.user_id}`
        );
        
        res.status(400).send({
          success: false,
          message: "Could not find user",
        });
        return;
      }
      
    // Get favorite movies
    const favoriteMovies = await FavoriteMovies.findAll({ where: { user_id: req.user_id } });

    if (!favoriteMovies.length) {
      ServerGlobal.getInstance().logger.error(
        `<getFavoriteMovies>: Failed to find favorite movies for user with id ${req.user_id}`
        );
        
        res.status(400).send({
          success: false,
          message: "Could not find favorite movies",
        });
        return;
    }
      
    ServerGlobal.getInstance().logger.info(`<getFavoriteMovies>: Got favorite movies`);

    // Get favorite movie id's
    const favoriteMovieIds = favoriteMovies.map((movie) => movie.movie_id);

    // Get movies by id's
    const movies = await Movie.findAll({ where: { id: favoriteMovieIds }});

    if (!movies) {
      ServerGlobal.getInstance().logger.error(
        `<getFavoriteMovies>: Failed to find movies for user with id ${req.user_id}`
        );
        
        res.status(400).send({
          success: false,
          message: "Could not find movies",
        });
        return;
    }

    ServerGlobal.getInstance().logger.info(`<getFavoriteMovies>: Successfully got favorite movies`);
 
    res.status(200).send({
      success: true,
      message: "Successfully retrieved favorite movies",
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
        like_count: movie.like_count,
      })),
    });
    return;
  } catch (e) {
    ServerGlobal.getInstance().logger.error(
      `<getFavoriteMovies>: Failed to get favorite movies because of server error: ${e}`
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
  getFavoriteMovies,
}