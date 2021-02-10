const asyncHandler = require("../middleware/async");
const { retrieveUser } = require("../store/preference/retrieveUser");
const createUser = require("../store/preference/createUser");
module.exports = asyncHandler(async (req, res) => {
  const cookie = req.body.cookie;
  let user = await retrieveUser(cookie);
  if (!user) {
    user = await createUser(cookie);
  }
  const emptyPreference = {
    genres: [],
    actors: [],
    directors: [],
    similarMovies: [],
    releaseYear: 0,
    duration: 999,
    rating: 0,
    givenRecommendations: [],
  };
  user.preferences.push(emptyPreference);
  await user.save().catch((err) => console.log(err));
  res.status(201).send();
});
