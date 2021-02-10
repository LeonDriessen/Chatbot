const request = require("superagent");
const asyncHandler = require("../middleware/async");

// @desc    GET query to chatbot on DialogFlow
// @route   GET /api/v1/query
// @access  Private

module.exports = asyncHandler(async (req, res) => {
  const {
    query: { sessionId },
  } = req;

  const NLP = await request
    .get("https://api.dialogflow.com/v1/query")
    .query({
      v: "20150910",
      sessionId,
      lang: "en",
      e: "WELCOME",
    })
    .set("Authorization", `Bearer ${process.env.DIALOG_FLOW_API_KEY}`)
    .send();

  const {
    body: {
      result: {
        contexts: resultContexts,
        fulfillment: { messages },
      },
    },
  } = NLP;

  res.status(200).send({ contexts: resultContexts, messages });
});
