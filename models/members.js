var mongoose = require("mongoose");

var memberSchema = mongoose.Schema({
  current: Boolean,
  name: String,
  image: String,
  year: String,
  hasPosition: Boolean,
  position: String
});

var Member = mongoose.model("Member", memberSchema);
module.exports = Member;
