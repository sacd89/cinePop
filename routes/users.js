var express = require('express');
var router = express.Router();
const userController = require('./../controllers/users');
const isLoggedIn = require('./../auth/passport.js').isLoggedIn;
const checkIsAdmin = require('./../auth/passport.js').checkIsAdmin;


router.get('/', isLoggedIn, checkIsAdmin, userController.list);

router.get('/blank', userController.blank);

router.post('/create', userController.create);

router.get('/show/:id', isLoggedIn, checkIsAdmin, userController.show);

router.post('/save', isLoggedIn, checkIsAdmin, userController.save);

router.get('/changePass/:id', isLoggedIn, checkIsAdmin, userController.changePass);

router.post('/savePass', isLoggedIn, checkIsAdmin, userController.savePass);

router.post('/delete', isLoggedIn, checkIsAdmin, userController.deleteUser);

module.exports = router;
