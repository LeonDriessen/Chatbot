const uuid = require("uuid");
const asyncHandler = require("../middleware/async");
const createUser = require("../store/preference/createUser");

module.exports = asyncHandler(async (req, res) => {
  const cookie = uuid.v4();
  await createUser(cookie);
  res.status(201).send({ data: cookie });
});
