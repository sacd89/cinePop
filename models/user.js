const mongoose = require('mongoose');
const schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const userTypes = ['ADMIN','EMPLOYEE'];

var userSchema = schema({
    name: String,
    password: String,
    email: String,
    userType:{type:String, enum:userTypes}
});

/**
 * Clase que contiene los métodos que utiliza el modelo Usuarios.
 */
class UserClass{

    /**
     * Constructor vacío.
     */
    constructor(){}


    /**
     * Genera la encriptación de la contraseña por medio de la libreria bcrypt.
     * @param password {@code String} a encriptar
     */
    generateHash(password) {
        this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    /**
     * Verifica que la constraseña mandada sea igual que la encriptada en el user.
     *
     * @param password {@code String} texto a comparar
     * @returns {boolean} si coincide o no la contraseña
     */
    validatePassword(password) {
        console.log("PASS", password);
        return bcrypt.compareSync(password, this.password);
    };

    static findByEmail(email){
        return this.constructor.findOne({"email":email});
    }

    /**
     * Verifica que el email ingresado no se encuentre utiliado por otro user.
     *
     * @returns {boolean} si el email ya esta siendo utilizado por otro user.
     */
    isDuplicateEmail(next) {
        this.constructor.findOne({email:this.email}).exec(function (err, user) {
            return err ? next(true) : user != undefined ? next(true) : next(false);
        });
    }

    /**
     * Verifica que el email ingresado no se encuentre utiliado por otro usuario, que no
     * sea el que se esta editando.
     *
     * @returns {boolean} si el email ya esta siendo utilizado por otro usuario.
     */
    isDuplicateEmailShow(userId, next) {
        this.constructor.findOne({email:this.email}).exec(function (err, user) {
            return err ? next(true) : user != undefined && user._id != userId  ? next(true) : next(false);
        })
    }


    /**
     * Verifica si el email es valido por medio de una regex.
     *
     * @returns {boolean} si es un email válido.
     */
    verifyValidEmail(){
        return re.test(this.email);
    }


}

userSchema.loadClass(UserClass);
let User = mongoose.model('User', userSchema);
module.exports = {
    User,
    userTypes
};