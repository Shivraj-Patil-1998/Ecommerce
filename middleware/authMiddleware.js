// to verify the JWT token and also user is Admin or Not

const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
