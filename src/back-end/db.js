const mongoose = require("mongoose");

const connect = () => {
  mongoose.connect(process.env.MONGO_ATLAS_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

module.exports = { connect };
