const asyncHandler = require("../middleware/async");
const { retrieveUser } = require("../store/preference/retrieveUser");

module.exports = asyncHandler(async (req, res) => {
  const cookie = req.body.cookie;
  const id = req.body.sonaID;
  const user = await retrieveUser(cookie);
  user.sonaID = id;
  await user.save().catch((err) => console.log(err));
  res.status(201).send();
});
