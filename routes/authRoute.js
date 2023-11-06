const express = require("express");
const router = express.Router();
const {createUser, loginUserCtrl, getallUser, getSingleUser, deleteaUser, updateaUser} = require('../controller/userCtrl')

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getallUser);
router.get("/:id", getSingleUser);
router.delete("/:id", deleteaUser);
router.put("/:id", updateaUser);

module.exports = router;