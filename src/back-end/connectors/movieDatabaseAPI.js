const request = require("superagent");

const MOVIEDB_BASE_URL = "https://api.themoviedb.org";
const DEFAULT_SETTINGS = {
  api_key: process.env.MOVIE_DB_API_KEY,
  language: "en-US",
};

exports.discoverMovie = async (options = {}) => {
  const response = await request
    .get(`${MOVIEDB_BASE_URL}/3/discover/movie`)
    .set("Content-Type", "application/json;charset=utf-8")
    .query({
      ...DEFAULT_SETTINGS,
      sort_by: "popularity.desc",
      with_original_language: "en",
      include_adult: false,
      include_video: false,
      page: 1,
      ...options,
    })
    .send();

  return response.body;
};

exports.getMovieDetails = async (options = {}) => {
  let response;
  try {
    response = await request
      .get(`${MOVIEDB_BASE_URL}/3/movie/${options.movie_id}`)
      .set("Content-Type", "application/json;charset=utf-8")
      .query({ ...DEFAULT_SETTINGS, ...options })
      .send();

    return response.body;
  } catch (error) {
    return {};
  }
};

exports.getSimilarMovies = async (options = {}) => {
  const response = await request
    .get(`${MOVIEDB_BASE_URL}/3/movie/${options.movie_id}/similar`)
    .set("Content-Type", "application/json;charset=utf-8")
    .query({ ...DEFAULT_SETTINGS, ...options })
    .send();

  return response.body;
};

exports.getMovieGenres = async (options = {}) => {
  const response = await request
    .get(`${MOVIEDB_BASE_URL}/3/genre/movie/list`)
    .set("Content-Type", "application/json;charset=utf-8")
    .query({ ...DEFAULT_SETTINGS, ...options })
    .send();

  return response.body.genres;
};

exports.searchPerson = async (options = {}) => {
  const response = await request
    .get(`${MOVIEDB_BASE_URL}/3/search/person`)
    .set("Content-Type", "application/json;charset=utf-8")
    .query({ ...DEFAULT_SETTINGS, ...options })
    .send();

  return response.body;
};

exports.searchMovie = async (options = {}) => {
  const response = await request
    .get(`${MOVIEDB_BASE_URL}/3/search/movie`)
    .set("Content-Type", "application/json;charset=utf-8")
    .query({ ...DEFAULT_SETTINGS, ...options })
    .send();

  return response.body;
};
