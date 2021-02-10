const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: String,
  sonaID: String,
  preferences: [
    {
      genres: Array,
      actors: Array,
      directors: Array,
      similarMovies: Array,
      releaseYear: Number,
      duration: Number,
      rating: Number,
      givenRecommendation: Array,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
