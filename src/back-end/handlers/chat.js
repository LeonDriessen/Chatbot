const request = require("superagent");
const asyncHandler = require("../middleware/async");
const { updatePreferences } = require("../store/preference/updatePreferences");
const { dissectBody } = require("../services/retrievePreferencesFromBody");

// @desc    POST query to chatbot on DialogFlow
// @route   POST /api/v1/query
// @access  Private
module.exports = asyncHandler(async (req, res) => {
  const {
    query: { sessionId },
    body: { contexts, message },
  } = req;

  const NLP = await request
    .post("https://api.dialogflow.com/v1/query")
    .query({ v: "20150910" })
    .set("Authorization", `Bearer ${process.env.DIALOG_FLOW_API_KEY}`)
    .send({
      contexts,
      lang: "en",
      query: message,
      sessionId,
      timezone: "Amsterdam",
    });

  const {
    body: {
      result: {
        contexts: resultContexts,
        fulfillment: { messages },
      },
    },
  } = NLP;

  const isGoodbye = NLP.body.result.metadata.intentName === "goodbye-intent";
  if (isGoodbye) {
    try {
      const date = Date.now();
      const password = Buffer.from(date.toString()).toString("base64");
      const passwordMessage = {
        speech: `Your password is: ${password}    Please copy-paste this into Qualtrics!`,
      };

      messages.push(passwordMessage);
    } catch (error) {
      console.error(error);
    }
  }

  const { preferenceType, resolvedQuery } = dissectBody(NLP.body);
  const noInstantUpdate = ["actor", "director", "similarMovies"];

  if (!noInstantUpdate.includes(preferenceType) && preferenceType && resolvedQuery) {
    await updatePreferences({
      sessionId,
      preferenceType,
      newValue: resolvedQuery,
    });
  }

  res.status(200).send({ contexts: resultContexts, messages, isGoodbye });
});
