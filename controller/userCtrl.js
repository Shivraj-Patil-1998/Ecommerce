const { generateToken } = require("../config/jwtToken");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler")

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

//Update a User
const updateaUser = asyncHandler( async(req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
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
  try {
    const deleteaUser = await User.findByIdAndDelete(id)
    res.json({
      deleteaUser
    })
  } catch {
    throw new Error(error)
  }
});


module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getSingleUser,
  deleteaUser,
  updateaUser
};