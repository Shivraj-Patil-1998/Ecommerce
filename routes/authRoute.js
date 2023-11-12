const express = require("express");
const router = express.Router();
const {createUser, loginUserCtrl, getallUser, getSingleUser, deleteaUser, updateaUser, blockUser, unBlockUser, handleRefreshToken, logOut} = require('../controller/userCtrl')
const {authMiddleware, isAdmin} = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getallUser);
router.get("/refresh-token", handleRefreshToken);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteaUser);
router.put("/edit-user", authMiddleware, updateaUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin,  unBlockUser);
router.get("/logout", logOut);

module.exports = router;