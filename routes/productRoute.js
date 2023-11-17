const express = require("express");
const {
  createProduct,
  getaProduct,
  getallProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productCtrl");
const router = express.Router();
const { isAdmin, authMiddleware} = require('../middleware/authMiddleware')

router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/:id", getaProduct);

router.put("/:id", authMiddleware, isAdmin, updateProduct);

router.get("/", getallProduct);

router.delete("/:id", authMiddleware, isAdmin, deleteProduct)

module.exports = router;