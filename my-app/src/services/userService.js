const User = require('../models/User');

async function findOrCreateUser({ email, name, googleId }) {
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ name, email, googleId });
    await user.save();
  }
  return user;
}

module.exports = { findOrCreateUser };
