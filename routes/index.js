var express = require('express');
var router = express.Router();
let passport = require('./../auth/passport.js').passport;
let User = require('../models/user.js').User;
const isLoggedIn = require('../auth/passport.js').isLoggedIn;

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/', isLoggedIn, function(req, res, next) {
    res.render('index', { title: 'Express' });
});


module.exports = router;
