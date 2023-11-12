const { generateToken } = require("../config/jwtToken");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validatemongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");

// Create a new user
const createUser = asyncHandler((async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    //create new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
}));

// Login a user
const loginUserCtrl = asyncHandler(async(req, res) => {
  const {email, password} = req.body;
  //check user exist or not
  const findUser = await User.findOne({ email: email });
  if(findUser && await findUser.isPasswordMatched(password)){
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id)
    })
  } else {
    throw new Error("Invalid Credentials")
  }
});

//handle refresh Token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if(!cookie?.refreshToken) throw new Error("No refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if(!user) throw new Error("No refresh token founf in DB or not match");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if(err || user.id !== decoded.id){
      throw new Error("There is something wrong with refresh Token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  })
})

//logout User
const logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if(!cookie?.refreshToken) throw new Error("No refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if(!user){
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true
    });
   return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true
  });
  res.sendStatus(204);
})

//Update a User
const updateaUser = asyncHandler( async(req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, {
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      email: req?.body?.email,
      mobile: req?.body?.mobile
    }, {
      new: true
    });
    res.json(updatedUser)
  }catch{
    throw new Error(error)
  }
})

//Get a all user
const getallUser = asyncHandler(async(req, res) => {
  try {
    const getUsers = await User.find()
    res.json(getUsers)
  } catch {
    throw new Error(error)
  }
});

//Get single User
const getSingleUser = asyncHandler(async(req, res) => {
  const {id} = req.params;
  validateMongodbId(id);
  try {
    const getSingleUser = await User.findById(id)
    res.json({
      getSingleUser
    })
  } catch {
    throw new Error(error)
  }
});

//Delete single User
const deleteaUser = asyncHandler(async(req, res) => {
  const {id} = req.params;
  validateMongodbId(id);
  try {
    const deleteaUser = await User.findByIdAndDelete(id)
    res.json({
      deleteaUser
    })
  } catch {
    throw new Error(error)
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongodbId(id);
  try{
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true
      },
      {
        new: true
      }
    );
    res.json({
      message: "User Blocked"
    });
  } catch(error){
    throw new Error(error)
  }
})
const unBlockUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongodbId(id);
  try{
    const unBlock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false
      },
      {
        new: true
      }
    );
    res.json({
      message: "User Unblocked"
    });
  } catch(error){
    throw new Error(error)
  }
})


module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getSingleUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOut
};