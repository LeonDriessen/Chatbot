const User = require("../../models/user");
const { retrieveUser } = require("./retrieveUser");

const updatePreferences = async ({ sessionId, preferenceType, newValue }) => {
  const user = await retrieveUser(sessionId);
  const userPreferences = user.preferences[user.preferences.length - 1];
  const {
    actors: actorsValue,
    directors: directorsValue,
    genres: genresValue,
    similarMovies: similarMoviesValue,
    givenRecommendation: givenRecommendationValue,
  } = userPreferences;

  switch (preferenceType) {
    case "actor":
      if (actorsValue && !actorsValue.includes(newValue)) {
        actorsValue.push(newValue);
      }
      break;
    case "director":
      if (directorsValue && !directorsValue.includes(newValue)) {
        directorsValue.push(newValue);
      }
      break;
    case "genres":
      newValue.forEach((value) => {
        if (genresValue && !genresValue.includes(value)) {
          genresValue.push(value);
        }
      });
      break;
    case "similarMovies":
      if (similarMoviesValue) {
        newValue.forEach((movie) => {
          if (!similarMoviesValue.includes(movie)) {
            similarMoviesValue.push(movie);
          }
        });
      }
      break;
    case "duration":
      userPreferences.duration = Number(newValue);
      break;
    case "releaseYear":
      userPreferences.releaseYear = Number(newValue);
      break;
    case "rating":
      userPreferences.rating = Number(newValue);
      break;
    case "givenRecommendation":
      if (givenRecommendationValue && !givenRecommendationValue.includes(newValue)) {
        givenRecommendationValue.push(newValue);
      }
      break;
  }
  await user.save();
};

module.exports = { updatePreferences };
