const asyncHandler = require("../middleware/async");
const { extractSessionId } = require("../utils/session");
const User = require("../models/user");
const recommendationHandler = require("./recommendation");
const personsHandler = require("./persons");
const informationHandler = require("./information");
const { retrieveUser } = require("../store/preference/retrieveUser");

module.exports = asyncHandler(async (req, res) => {
  const {
    session,
    queryResult: {
      intent: { displayName: intentName },
    },
  } = req.body;

  const sessionId = extractSessionId(session);
  const preferences = await retrieveUser(sessionId);

  if (!preferences) {
    const user = new User({
      _id: sessionId,
      preferences: {
        genres: { value: [] },
        actors: { value: [] },
        directors: { value: [] },
        similarMovies: { value: [] },
        releaseYear: { value: 0 },
        duration: { value: 0 },
        rating: { value: 0 },
        givenRecommendations: { value: [] },
      },
    });

    user.save().catch((err) => console.log(err));
  }

  switch (intentName) {
    case "movie-recommendation":
      await recommendationHandler(req, res);
      break;
    case "actors-ask-yes":
      await personsHandler(req, res);
      break;
    case "director-ask-yes":
      await personsHandler(req, res);
      break;
    case "movie-information":
      await informationHandler(req, res);
      break;
    default:
      res.status(200).send();
  }
});
