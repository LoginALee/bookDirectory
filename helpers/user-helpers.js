const db = require("../models");

async function getUserByUsername(username) {
  const userByUsername = await db.User.findOne({
    where: { username: username },
  });
  return userByUsername;
}

async function getUserById(id) {
  const userByid = await db.User.findByPk(id);
  return userByid;
}

module.exports = { getUserById, getUserByUsername };
