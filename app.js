

var express               = require("express"),
    app                   = express(),
    path                  = require('path'),
    mongoose              = require('mongoose'),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require('method-override'),
    passportLocalMongoose = require("passport-local-mongoose"),
    Member                = require('./models/members');
    User                  = require('./models/user');


mongoose.connect("mongodb://localhost/izzat"); // Connecting to the Database
app.set("view engine", "ejs"); // So I don't need to write .ejs
app.use(express.static(path.join(__dirname, 'public'))); // Used to stylesheets
app.use(bodyParser.urlencoded({extended: true})); // Body parser used to get code from POST request
app.use(methodOverride('_method')); // Change Put --> Post
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

// Authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.get("/LogIn", function(req, res) {
  res.render("maintenance/LogIn");
});

app.post("/LogIn", passport.authenticate("local", {
  successRedirect: "/maintenance",
  failureRedirect: "/LogIn"
}), function(req, res) {
  // res.send("This is the post request")
  // res.render("maintenance/LogIn");
});

app.get("/Register", function(req, res) {
  res.render("maintenance/Register");
});

var authorization_code = "MichiganIzzat"
app.post("/Register", function(req, res) {
  if (req.body.authCode === authorization_code){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('maintenance/Register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/maintenance");
        });
    });
  } else {
    res.render("maintenance/register");
  }
});

app.get("/LogOut", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/maintenance", isLoggedIn, function(req, res) {
  res.render("maintenance/maintenanceMain");
});

app.get("/maintenance/Member/Edit", isLoggedIn, function(req, res) {
  Member.find({}, function(err, members) {
    if (err) {
      console.log(err);
    } else {
      res.render("maintenance/member/ShowAll", { members: members });
    }
  });
});

// New form for members
app.get("/maintenance/Member/New", isLoggedIn, function(req, res) {
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
app.get("/maintenance/Member/Update/:id", isLoggedIn, function(req, res){
  Member.findById(req.params.id, function(err, individualMember){
    if (err) {
      console.log(err);
    } else {
      console.log(individualMember);
      res.render("maintenance/member/Update", {individualMember: individualMember});
    }
  });
});

// Updating members in database
app.put("/maintenance/Member/Update/:id", isLoggedIn, function(req, res){
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

// Deleting Members from database
app.delete("/maintenance/Member/Delete/:id", isLoggedIn, function(req, res){
  Member.findById(req.params.id, function(err, member){
    if (err) {
      console.log(err);
    } else {
      member.remove();
      res.redirect("/maintenance/Member/Edit");
    }
  });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

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
