const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
let User = require('./../models/user.js').User;

passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done) {
        User.findOne({ email: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validatePassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

/**
 * Función utilizada para serializar el user dentor de la sesión.
 */
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

/**
 * Función utilizada para desserializar el user dentor de la sesión para su utilización..
 */
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

/**
 * Revisa si existe un user logueado a la aplicación, en caso de no existir redireciona al inicio de sesión.
 */
function isLoggedIn(req, res, next) {
    if (req.user){
        return next();
    } else {
        res.redirect('/login');
    }
};

function checkIsAdmin(req, res, next){
    if(req.user.userType === "ADMIN"){
        next();
    } else {
        let err = new Error('Access Denied');
        err.status = 403;
        next(err);
    }
};

function checkIsEmployee(req, res, next){
    if(req.user.userType === "EMPLOYEE"){
        next();
    } else {
        let err = new Error('Access Denied');
        err.status = 403;
        next(err);
    }
};



module.exports = {
    passport,
    isLoggedIn,
    checkIsAdmin,
    checkIsEmployee
};