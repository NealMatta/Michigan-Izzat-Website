var express   = require("express"),
    app       = express(),
    path      = require('path');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/about", function(req, res) {
    res.render("about");
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

app.listen(3000, function(){
    console.log("Server has started");
});
