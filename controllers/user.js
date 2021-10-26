//////////////////////////////
// Import Dependencies
//////////////////////////////
const express = require("express")
const User = require("../models/user")
const bcrypt = require("bcryptjs")


///////////////////////////////
// Create Router
///////////////////////////////
const router = express.Router()

////////////////////////////
// ROUTES
////////////////////////////

// The Signup Routes (Get => Form, Post => form submit)
router.get("/signup", (req,res) => {
    res.render("user/signup.liquid")
})


//await can only be used if async if used. Together. 
router.post("/signup", async (req, res) => {
    // encrypt password
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))

    // save the user to our database
    User.create(req.body)
    .then((user) => {
        // log the user as a test
        console.log(user)
        // redirect user to login
        res.redirect("/user/login")
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })
})

//The Login routes (GET => form, Post => form submit)
//"/user/login"
router.get("/login", (req,res) => {
    res.render("user/login.liquid")
})

router.post("/login", (req,res) =>{
    // destructure username and password from req.body
    const {username, password} = req.body

    // search for the user
    User.findOne({username})
    .then(async (user) => {
        // check if the user exists
        if(user){
            // compare passswords
           const result = await bcrypt.compare(password, user.password)
           if (result){
               //store some data in the session object
               req.session.username = username
               req.session.loggedIn = true
                //redirect to fruit index page
                res.redirect("/fruits")
           } else {
               //send error of wrong password
                res.json({error: "password doesn't match"})
           }
        }   else {
                //send error that user doesn't exist
                res.json({error: "user doesn't exist"})
            }
    })

    .catch((error) => {
        res.json({error})
    })
})

//logout route, get request to /user/logout
router.get("/logout", (req,res) =>{
    //destory the session
    req.session.destroy((err) =>{
        //send user back to the main page
        res.redirect("/")
    })
})



////////////////////////////////
// export the router
/////////////////////////////////
module.exports = router