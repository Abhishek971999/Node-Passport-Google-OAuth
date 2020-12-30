const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser(function (user, done) {
  // From the user take just the id (to minimize the cookie size) and just pass the id of the user
  // to the done callback
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  // Instead of user this function usually recives the id
  // then you use the id to select the user from the db and pass the user obj to the done callback
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);
