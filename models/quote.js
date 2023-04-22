const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const quoteSchema = new mongoose.Schema({
  text: String,
  author: String,
  color: String,
  approved: Boolean,
});

quoteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Quote", quoteSchema);
