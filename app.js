var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  path = require('path'),
  mongoose = require('mongoose'),
  Member = require('./models/members');

// Connecting to the Database
mongoose.connect("mongodb://localhost/izzat");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
})); // Body parser used to get code from POST request

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
      res.render("about", { members: members });
    }
  });
});

// Section Overlay to add new items
app.get("/updatingOverview", function(req, res) {
  res.render("addingItems");
});

// New form for members
app.get("/updatingOverview/Member/New", function(req, res) {
  res.render("addMember");
});

app.post("/updatingOverview/Member/New", function(req, res) {
  Member.create(req.body.member, function(err, newMem) {
    if (err) {
      res.render("addMember");
    } else {
      res.redirect("/updatingOverview");
    }
  });
});

// Updating Existing Members
app.get("/updatingOverview/Member/Change", function(req, res) {
  Member.find({}, function(err, members) {
    if (err) {
      console.log(err);
    } else {
      res.render("searchMember", { members: members });
    }
  });
});

app.get("/updatingOverview/Member/Update/:id", function(req, res){

});

app.get("/updatingOverview/Member/Delete/:id", function(req, res){

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
app.get("*", function(req, res) {
  res.send("This does not exist");
});

app.listen(3000, function() {
  console.log("Server has started");
});

// Making input clean
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
