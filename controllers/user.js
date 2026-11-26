
const {v4: uuidv4} = require('uuid');
const user = require('../models/user');
const { setUser } = require('../service/auth');


async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  await user.create({ name, email, password });

  return res.redirect("/");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  const checkUser = await user.findOne({ email, password });

  if (!checkUser) {
    return res.render("login", {
      error: "Invalid email or password",
    });
  }

  // Generate JWT token
  const token = setUser(checkUser);

  // Store JWT token in cookie
  // res.cookie("uid", token);
  res.cookie("token",token);
  return res.redirect("/");
}

module.exports = {
  handleUserSignup,
  handleUserLogin
};
