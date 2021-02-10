const _ = require("lodash");

const dissectBody = (body) => {
  let resolvedQuery;
  let preferenceType;
  const parameters = body.result.parameters;
  const intentName = body.result.metadata.intentName;

  switch (intentName) {
    case "genre-ask":
      preferenceType = "genres";
      resolvedQuery = parameters.movie_genres;
      return { preferenceType, resolvedQuery };
    case "duration-ask-yes":
      preferenceType = "duration";
      resolvedQuery = parameters.number;
      return { preferenceType, resolvedQuery };
    case "year-ask-yes":
      preferenceType = "releaseYear";
      resolvedQuery = parameters.number;
      return { preferenceType, resolvedQuery };
    case "rating-ask-yes":
      preferenceType = "rating";
      resolvedQuery = parameters.number;
      return { preferenceType, resolvedQuery };
    case "movie-verification":
      //until the webhook works
      preferenceType = "similarMovies";
      resolvedQuery = parameters.movie_name[0];
      return { preferenceType, resolvedQuery };
    default:
      return false;
  }
};

module.exports = { dissectBody };
