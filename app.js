//jshint esversion:6


// in our .env file we keep our secrets to prevent them from being accesssed easily by the hackers and then put thtose secrets in the .env file
require('dotenv').config()
console.log(process.env.API_KEY);

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { stringify } = require("querystring");
const { rmSync } = require("fs");
var encrypt = require('mongoose-encryption');
mongoose.set("strictQuery" , false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema= new mongoose.Schema( {
    email: String,
     password: String
});

// this is our encryption in the database to encrpyt our database with some scerrets 

// below statemment willl encryt our password only 
userSchema.plugin(encrypt , {secret: process.env.SECRET  , encryptedFields: ["password"]});

const User = mongoose.model("User" , userSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

app.get("/" , function(req , res)

{
    res.render("home");
})

app.get("/login", function(req , res)
{

    res.render("login");
}
)

app.get("/register", function(req , res)
{

    res.render("register");
}
)

app.post("/register" , function(req , res)
{
    const newuser = new User({email: req.body.username  , password: req.body.password})

    newuser.save(function(err)
    {
        if(!err)
        {
            res.render("secrets");
        }
    })

}); 

app.post("/login" , function(req , res)
{
    const username = req.body.username;
    const pass = req.body.password;

    User.findOne({email: username} , function(err , use)
    {
        if(!err && use.password === pass)
        {
            res.render("secrets");
        }

        else 
        {
            res.send("No user with the entered identity");
        }

    })
})


app.listen(3333, function() {
  console.log("Server started on port 3000");
});
