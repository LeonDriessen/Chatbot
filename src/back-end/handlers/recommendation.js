const asyncHandler = require("../middleware/async");
const { extractSessionId, generateContextSession } = require("../utils/session");
const { callRecommendationEngine } = require("../recommender/index");
const { retrieveUser } = require("../store/preference/retrieveUser");
const { updatePreferences } = require("../store/preference/updatePreferences");
const retrieveGenresFromString = require("../services/retrieveGenresFromString");
const { discoverMovie, getMovieDetails } = require("../connectors/movieDatabaseAPI");

// @desc    POST give recommendation based on preferences
// @route   POST /api/v1/recommendation
// @access  Private
module.exports = asyncHandler(async (req, res) => {
  const {
    body: { session },
  } = req;

  const sessionId = extractSessionId(session);
  const user = await retrieveUser(sessionId);
  const preferences = user.preferences[user.preferences.length - 1];
  const genres = await retrieveGenresFromString({
    preferredGenres: preferences.genres,
  });

  let moviePromises = [];
  const discoverMoviePreferences = {
    with_genres: genres.join("|"),
    with_release_type: "2|3",
    "primary_release_date.lte": new Date().toISOString().slice(0, 10),
    "with_runtime.lte": preferences.duration !== 0 ? preferences.duration : null,
  };

  if (preferences.releaseYear !== 0) {
    discoverMoviePreferences["primary_release_date.gte"] = `${preferences.releaseYear}-01-01`;
  }

  for (let page = 1; page <= 3; page += 1) {
    moviePromises.push(discoverMovie({ ...discoverMoviePreferences, page }));
  }

  let allMovies = await Promise.all(moviePromises);
  let reducedMovies = allMovies.reduce((acc, cur) => [...acc, ...cur.results], []);

  // If no movies are found with all filters, restrict to only genre search
  if (!reducedMovies.length) {
    moviePromises = [];
    for (let page = 1; page <= 3; page += 1) {
      moviePromises.push(
        discoverMovie({
          with_genres: genres.join("|"),
          with_release_type: "2|3",
          "primary_release_date.lte": new Date().toISOString().slice(0, 10),
          page,
        })
      );
    }

    allMovies = await Promise.all(moviePromises);
    reducedMovies = allMovies.reduce((acc, cur) => [...acc, ...cur.results], []);
  }

  const promises = [];
  for (const movie of reducedMovies) {
    const { id } = movie;
    promises.push(getMovieDetails({ movie_id: id, append_to_response: "credits" }));
  }

  const movies_extended = await Promise.all(promises);
  const movies = movies_extended
    .map((e) => ({
      imdb_id: e.id,
      movie_title: e.original_title,
      release_date: new Date(e.release_date).getFullYear(),
      genres: (e.genres || []).map((genre) => genre.name.toLowerCase()),
      runtime: e.runtime || 0,
      directors: ((e.credits || {}).crew || []).filter((person) => person.job === "Director").map((e) => e.name),
      description: e.overview,
      actors: ((e.credits || {}).cast || []).map((actor) => actor.name),
      vote_average: e.vote_average,
    }))
    .filter((e) => e.runtime !== 0 && e.imdb_id);

  const recommendation = await callRecommendationEngine({
    previousMovies: null,
    movies,
    similar_movies: [],
    preferences,
  });

  await updatePreferences({
    sessionId,
    preferenceType: "givenRecommendation",
    newValue: recommendation,
  });

  res.send({
    outputContexts: [
      {
        name: generateContextSession({
          session: sessionId,
          context: "movieRecommendation-followup",
        }),
        lifespanCount: 1,
      },
    ],
    followupEventInput: {
      name: "recommendation",
      languageCode: "en-US",
      parameters: {
        movie_title: recommendation.movie_title,
        movie_year: recommendation.release_date,
        movie_director: recommendation.directors,
      },
    },
  });
});
