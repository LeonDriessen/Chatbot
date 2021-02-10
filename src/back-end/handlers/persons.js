const asyncHandler = require("../middleware/async");
const { extractSessionId } = require("../utils/session");
const { searchPerson } = require("../connectors/movieDatabaseAPI");
const { updatePreferences } = require("../store/preference/updatePreferences");

module.exports = asyncHandler(async (req, res) => {
  const {
    session,
    queryResult: { queryText: person },
  } = req.body;

  const sessionId = extractSessionId(session);

  const { results: persons } = await searchPerson({ query: person });
  if (!persons) {
    console.warn("No actors / directors found");
  }

  if (persons.length === 0) {
    await updatePreferences({
      sessionId,
      preferenceType: "actor",
      newValue: person,
    });

    await updatePreferences({
      sessionId,
      preferenceType: "director",
      newValue: person,
    });

    res.send({});
    return;
  }

  const [{ name, known_for_department }] = persons;
  switch (known_for_department) {
    case "Acting":
      await updatePreferences({
        sessionId,
        preferenceType: "actor",
        newValue: name,
      });

      break;
    case "Directing":
      await updatePreferences({
        sessionId,
        preferenceType: "director",
        newValue: name,
      });

      break;
    default:
      await updatePreferences({
        sessionId,
        preferenceType: "actor",
        newValue: person,
      });

      await updatePreferences({
        sessionId,
        preferenceType: "director",
        newValue: person,
      });
      break;
  }

  res.send({});
});
