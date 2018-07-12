

var express = require("express"),
    app = express(),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require("body-parser"),
    methodOverride = require('method-override'),
    Member = require('./models/members');


mongoose.connect("mongodb://localhost/izzat"); // Connecting to the Database
app.set("view engine", "ejs"); // So I don't need to write .ejs
app.use(express.static(path.join(__dirname, 'public'))); // Used to stylesheets
app.use(bodyParser.urlencoded({extended: true})); // Body parser used to get code from POST request
app.use(methodOverride('_method')); // Change Put --> Post
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

// ~~~ Pages for visitors ~~~
app.get("/", function(req, res) {
  res.render("main/landing");
});

app.get("/about", function(req, res) {
  Member.find({}, function(err, members) {
    if (err) { // If there is an error, log it and render back the landing page
      console.log(err);
      res.render("main/landing");
    } else {
      res.render("main/about", { members: members });
    }
  });
});

app.get("/contact", function(req, res) {
  res.render("main/contact");
});

app.get("/donate", function(req, res) {
  res.render("main/donate");
});

app.get("/events", function(req, res) {
  res.render("main/events");
});

// ~~~ Pages for members ~~~
app.get("/maintenance", function(req, res) {
  res.render("maintenance/maintenanceMain");
});

app.get("/maintenance/Member/Edit", function(req, res) {
  Member.find({}, function(err, members) {
    if (err) {
      console.log(err);
    } else {
      res.render("maintenance/member/ShowAll", { members: members });
    }
  });
});

// New form for members
app.get("/maintenance/Member/New", function(req, res) {
  res.render("maintenance/member/New");
});

// Adding members to Database
app.post("/maintenance/Member/New", function(req, res) {
  Member.create(req.body.member, function(err, newMem) {
    if (err) {
      res.render("maintenance/member/New");
    } else {
      res.redirect("maintenance");
    }
  });
});

// Updating Existing Members
app.get("/maintenance/Member/Update/:id", function(req, res){
  Member.findById(req.params.id, function(err, individualMember){
    if (err) {
      console.log(err);
    } else {
      console.log(individualMember);
      res.render("maintenance/member/Update", {individualMember: individualMember});
    }
  });
});

app.put("/maintenance/Member/Update/:id", function(req, res){
  console.log("Put Request processed");
  Member.findByIdAndUpdate(req.params.id, req.body.member, function(err, individualMember){
    if (err) {
      console.log(err);
    } else {
      console.log(req.body.member);
      var showUrl = "/maintenance/Member/Update/" + individualMember._id;
      res.redirect(showUrl);
    }
  });

});

app.get("/maintenance/Member/Delete/:id", function(req, res){
  res.send("Delete")

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
