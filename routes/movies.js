var express = require('express');
var router = express.Router();
const movieController = require('./../controllers/movies');
const isLoggedIn = require('./../auth/passport.js').isLoggedIn;
const checkIsAdmin = require('./../auth/passport.js').checkIsAdmin;

router.get('/', isLoggedIn, checkIsAdmin, movieController.list);

router.get('/blank', isLoggedIn, checkIsAdmin, movieController.blank);

router.post('/create', isLoggedIn, checkIsAdmin, movieController.create);

router.get('/show/:id', isLoggedIn, checkIsAdmin, movieController.show);

router.post('/save', isLoggedIn, checkIsAdmin, movieController.save);

router.post('/delete', isLoggedIn, checkIsAdmin, movieController.deleteMovie);

module.exports = router;