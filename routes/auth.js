const express = require('express')
const passport = require('passport')
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google',  passport.authenticate('google', { scope: ['profile'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
    '/google/callback',ensureAuth,
    passport.authenticate('google', { successRedirect: '/dashboard', failureRedirect: '/' })
);

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', ensureAuth,(req, res, next) => {
    req.logout((error) => {
        if (error) { return next(error) }
        req.session.destroy();
        res.redirect('/')
    })
});
module.exports = router
