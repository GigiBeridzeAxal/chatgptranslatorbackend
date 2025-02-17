const express = require('express')

const dotenv = require('dotenv')
const cors = require('cors')
const ConnectDB = require('./modules/ConnectDB')
const http = require('http')
const socketio = require('socket.io')
const jwt = require('jsonwebtoken')
const ChattingModel = require('./models/ChattingModel')
const { io, app , server} = require('./socket')
const passport = require('passport')



dotenv.config()
app.use(passport.initialize())
app.use(cors({
    origin:'*'
   }))
   app.use(express.json({ limit: '250mb' }));  // For JSON requests (set limit to 10MB)
app.use(express.urlencoded({ limit: '250mb', extended: true }));  // For form submissions
app.use(express.json())
ConnectDB()

app.use('/' , require('./routes/UserRoute'))
app.use('/' , require('./routes/Chattingrouter'))

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('./models/UserModel');



passport.use(new GoogleStrategy({
    clientID: process.env.GoogleId,
    clientSecret: process.env.GoogleSecret,
    callbackURL: 'http://localhost:4000/auth/callback',
  }, async (token, tokenSecret, profile, done) => {
    try {
      // Check if user already exists

       let user = await UserModel.findOne({ email: profile.emails[0].value });


       const email = profile.emails[0].value
       const lastname = profile.name.familyName
       const firstname =  profile.name.givenName
       const password = profile.id
       if (!user) {
         user = new UserModel({
            email , firstname , lastname , password
         });
         await user.save();
       }
   
  
      // Create JWT token
                const token = jwt.sign({email , firstname , lastname , id:user._id} , process.env.SECRETKEY , {expiresIn:'1d'})
      
      return done(null, { user, token: token });
    } catch (error) {
      return done(error, false);
    }
  }));







server.listen(4000 , console.log("Server Succesfuly Launched"))