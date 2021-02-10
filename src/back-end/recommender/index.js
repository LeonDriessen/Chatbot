const request = require("superagent");

const callRecommendationEngine = async ({ previousMovies, movies, similar_movies, preferences }) => {
  try {
    const data = await request
      .post(`localhost:${process.env.PYTHON_PORT}`)
      .query({ technique: "default" })
      .send({
        previousMovies,
        movies,
        similar_movies,
        preferences,
      });

    return JSON.parse(data.text);
  } catch (error) {
    console.error("Error during recomendation");
    console.error(error);
  }
};

module.exports = {
  callRecommendationEngine,
};
