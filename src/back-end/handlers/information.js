const asyncHandler = require("../middleware/async");
const { retrieveUser } = require("../store/preference/retrieveUser");
const { extractSessionId, generateContextSession } = require("../utils/session");

// @desc    GET query to chatbot on DialogFlow
// @route   GET /api/v1/query
// @access  Private
module.exports = asyncHandler(async (req, res) => {
  const {
    session,
    queryResult: {
      parameters: { movie_info_key },
    },
  } = req.body;

  const sessionId = extractSessionId(session);
  const user = await retrieveUser(sessionId);
  const [
    {
      givenRecommendation: [recommendation],
    },
  ] = user.preferences.slice(-1);

  let movie_info_value;

  if (!recommendation) {
    movie_info_value = "unknown";
  } else {
    switch (movie_info_key) {
      case "duration":
        movie_info_value = `${recommendation.runtime} minutes`;
        break;
      case "genre":
        movie_info_value = recommendation.genres;
        break;
      case "rating":
        movie_info_value = recommendation.vote_average;
        break;
      case "cast":
        movie_info_value = recommendation.actors;
        break;
      case "description":
        movie_info_value = recommendation.description;
        break;
    }
  }

  res.send({
    outputContexts: [
      {
        name: generateContextSession({
          session: sessionId,
          context: "movie-information",
        }),
        lifespanCount: 1,
      },
    ],
    followupEventInput: {
      name: "information",
      languageCode: "en-US",
      parameters: {
        movie_info_value: movie_info_value,
        movie_info_key: movie_info_key,
      },
    },
  });
});
