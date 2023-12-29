const asyncHandler = require("express-async-handler");

// @desc Auth User/set token
// route POST /api/users/auth
// @access public
exports.authUser = asyncHandler(async (req, res) => {
  // testing error middle ware  dummy error
  // res.status(401);
  // throw new Error("This is Dummy Error to check if middleware working or not...")
  res.status(200).json({ message: "Auth User" });
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Register User" });
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
exports.logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "logout User" });
});
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (should Have valid JWt token)
exports.getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "User profile" });
});
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "update user Profile" });
});

// export {
//   authUser,
//   registerUser,
//   logoutUser,
//   getUserProfile,
//   updateUserProfile,
// };
