const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    const conn = mongoose.connect("mongodb+srv://shivrajpatil0027:rx1LWbFjgyUI0ovy@cluster0.d0zkig1.mongodb.net/ecommerce");
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("DAtabase error");
  }
};
module.exports = dbConnect;