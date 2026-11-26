const {getUser} = require('../service/auth');

// for authentication
function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;

  if(!tokenCookie) {
    return next();
  }
  
  const token = tokenCookie;
  const user = getUser(token);

  req.user = user;
  next();
}
// give role like admin, user, etc

function restrictTo(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login");
    }

    if (!roles.includes(req.user.role)) {
      return res.end("unauthorized");
    }

    return next();
  };
}

module.exports = {  
  restrictTo,
  checkForAuthentication
};  
