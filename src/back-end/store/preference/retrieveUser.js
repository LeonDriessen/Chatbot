const User = require("../../models/user");

const retrieveUser = async (cookie) => {
  const user = await User.findById(cookie);
  return user;
};

module.exports = { retrieveUser };
