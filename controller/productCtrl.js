const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getallProduct = asyncHandler(async (req, res) => {
  try {

    // --------->this is the old filter method
    // const getallProducts = await Product.find(req.query);

    //  ----------> bit advance filter method
    // const getallProducts = await Product.find({
    //   brand: req.query.brand,
    //   category: req.query.category,
    //   other queries if needed
    // });

    // --------> Advance level of filtering method
    // const getallProducts = await Product.where("category").equals(req.query.category);

    // Lets follow old methods with new concept

    //filtering
    const queryObj = {...req.query};
    const excludeField = ["page", "sort", "limit", "fields"];
    excludeField.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    //sorting
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    //limiting the fields
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(" ");
      query = query.select(fields)
    } else {
      query = query.select("-__v")
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if(req.query.page){
      const productCount = await Product.countDocuments();
      if(skip >= productCount) throw new Error('This page does not exist')
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getaProduct,
  getallProduct,
  updateProduct,
  deleteProduct,
};
