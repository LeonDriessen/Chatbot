const User = require("../../models/user");

const createUser = async (cookie) => {
  const user = new User({
    _id: cookie,
    sonaID: null,
    preferences: [],
  });
  await user.save().catch((err) => console.log(err));
  return user;
};

module.exports = createUser;
