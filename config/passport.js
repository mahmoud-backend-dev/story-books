const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const mongoose = require('mongoose');
const User = require('../models/User');
const GOOGLE_CLIENT_ID = "473334495668-bh8b4rgfp8huo10a6oj9v6g6o8sjk0jk.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET ="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"
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID, // process.env.GOOGLE_CLIENT_ID
        clientSecret: GOOGLE_CLIENT_SECRET , //process.env.GOOGLE_CLIENT_SECRET
        callbackURL: '/auth/google/callback'
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