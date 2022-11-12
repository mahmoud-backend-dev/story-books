const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const mongoose = require('mongoose');
const User = require('../models/User');
const GOOGLE_CLIENT_ID = "473334495668-1uk8ala1849657qajvigdlv7c9k1fp67.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET ="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"
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID, // process.env.GOOGLE_CLIENT_ID
        clientSecret: GOOGLE_CLIENT_SECRET , //process.env.GOOGLE_CLIENT_SECRET
        callbackURL: 'https://storybooks-me1812.herokuapp.com/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, cb) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                fristName: profile.name.givenName,
                lastName: profile.name.familyName,
                image:profile.photos[0].value
            }
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    cb(null, user);
                } else {
                    user = await User.create(newUser);
                    cb(null, user);
                }
            } catch (error) {
                console.error(error);
            }
        }
    ))
    passport.serializeUser((user, cb) => {
        cb(null, user.id)
    });
    passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
            cb(err, user);
        });
    });
}