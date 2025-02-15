const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const UserModel = require('./models/UserModel');


passport.use(new GoogleStrategy({
    clientID: "169596845347-646dva1bju3uqr96989mh0na6f1j5au9.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'http://localhost:5000/auth/google',
  }, async (token, tokenSecret, profile, done) => {
    try {
      // Check if user already exists
      let UserModel = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = new UserModel({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePic: profile.photos[0].value,
        });
        await user.save();
      }
  
      // Create JWT token
      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      return done(null, { user, token: jwtToken });
    } catch (error) {
      return done(error, false);
    }
  }));