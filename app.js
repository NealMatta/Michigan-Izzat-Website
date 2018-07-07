var express   = require("express"),
  app         = express(),
  bodyParser  = require("body-parser"),
  path        = require('path'),
  mongoose    = require('mongoose');

// Connecting to the Database
mongoose.connect("mongodb://localhost/izzat");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true})); // Body parser used to get code from POST request


// Creating the schema for each member
var memberSchema = mongoose.Schema({
  current: Boolean,
  name: String,
  image: String,
  year: String,
  // hasPosition: Boolean,
  // position: String
});

var Member = mongoose.model("Member", memberSchema);

// Member.create({
//   current: true,
//   name: "Vineeth",
//   image: "Nothing yet",
//   year: "Senior",
//   hasPosition: true,
//   position: "dictator"
// }, function(err, mem){
//   if (err){
//     console.log(err);
//   } else {
//     console.log(mem);
//   }
// }
// );

// ========== Routes ==========
app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/about", function(req, res) {
  Member.find({}, function(err, members) {
    if (err) { // If there is an error, log it and render back the landing page
      console.log(err);
      res.render("landing");
    } else {
      res.render("about", {members: members});
    }
  })
});

// Section Overlay to add new items
app.get("/updatingOverview", function(req,res) {
  res.render("addingItems");
});

// New form for members
app.get("/updatingOverview/newMember", function(req,res) {
  res.render("addMember");
});

app.post("/updatingOverview/newMember", function(req, res){
  // console.log(req.body.member);
  // res.redirect("/updatingOverview")
  Member.create(req.body.member, function(err, newMem){
    if(err){
      res.render("addMember");
    } else {
      console.log(req.body.member);
      res.redirect("/updatingOverview");
    }
  });
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/donate", function(req, res) {
  res.render("donate");
});

app.get("/events", function(req, res) {
  res.render("events");
});

// Failsafe to catch all broken Links
// Must be last call
app.get("*", function(req, res) {
  res.send("This does not exist");
});

app.listen(3000, function() {
  console.log("Server has started");
});
