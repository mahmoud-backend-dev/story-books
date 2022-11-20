const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const mongoose = require('mongoose');
const User = require('../models/User');
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID, // GOOGLE_CLIENT_ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET , // GOOGLE_CLIENT_SECRET
        callbackURL: 'https://storybooks-me1812.herokuapp.com/auth/google/callback',
        scope: ['profile']
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