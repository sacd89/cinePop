var express = require('express');
var router = express.Router();
const functionController = require('./../controllers/functions');
const isLoggedIn = require('./../auth/passport.js').isLoggedIn;
const checkIsAdmin = require('./../auth/passport.js').checkIsAdmin;

router.get('/', isLoggedIn, checkIsAdmin, functionController.list);

router.get('/blank', isLoggedIn, checkIsAdmin, functionController.blank);

router.post('/create', isLoggedIn, checkIsAdmin, functionController.create);

router.get('/show/:id', isLoggedIn, checkIsAdmin, functionController.show);

router.post('/save', isLoggedIn, checkIsAdmin, functionController.save);

router.post('/delete', isLoggedIn, checkIsAdmin, functionController.deleteFunction);

module.exports = router;