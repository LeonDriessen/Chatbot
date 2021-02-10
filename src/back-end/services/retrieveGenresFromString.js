const _ = require("lodash");
const { getMovieGenres } = require("../connectors/movieDatabaseAPI");

const retrieveGenresFromString = async ({ preferredGenres }) => {
  const movieGenres = await getMovieGenres();
  const genres = [];

  preferredGenres.forEach((genre) => {
    movieGenres.forEach((movie) => {
      if (genre.toLowerCase() === _.get(movie, "name", "").toLowerCase()) {
        genres.push(movie.id);
      }
    });
  });

  return genres;
};

module.exports = retrieveGenresFromString;
