// to verify the JWT token and also user is Admin or Not
// first we need to check user or admin is sending the token or Not
// if sending decode the token and verify

const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized, Token Expired, Login Again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const {email} = req.user;
    const adminUser = await User.findOne({email})
    if(adminUser.role !== "admin"){
      throw new Error ('you are not an admin')
    } else {
      next()
    }
});

module.exports = {
  authMiddleware,
  isAdmin,
};
