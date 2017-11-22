const express = require('express');
const mongoose = require('mongoose');
let User = require('../models/user.js').User;
const userTypes = require('./../models/user.js').userTypes;
var bcrypt = require('bcrypt-nodejs');

function list(req, res, next){
    User.find({})
        .exec()
        .then((users, err) =>{
        if(err) {
            return res.redirect('/', 404);
        } else {
            return res.render('./user/list', {users:users});
        }
    });
};

function blank(req, res, next){
    let user = new User();
    res.render('./user/blank', {user: user, userTypes:userTypes});
};

function create(req, res, next){
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        userType: req.body.userType
    });

    if(!user.verifyValidEmail()){
        return res.render('./user/blank', {user:user, userTypes:userTypes});
    }

    user.isDuplicateEmail((duplicate) => {
        if(duplicate){
            return res.render('./user/blank', {user:user});
        } else {

            if(req.body.password === req.body.confirmPassword){
                // console.log("USER", user);
                user.generateHash(req.body.password);
                user.save((err) => {
                    if(err) {
                        return res.render('./user/blank', {user:user, userTypes:userTypes});
                    } else {
                        return res.redirect('/users');
                    }
                });
            }else{
                return res.render('./user/blank', {user:user, userTypes:userTypes});
            }
        }
    });
};

function show(req, res, next){
    let userId = req.params.id;
    User.findOne({_id:mongoose.Types.ObjectId(userId)})
        .exec()
        .then((user, err) =>{
            if(err) {
                return res.redirect('/users', 404);
            } else {
                return res.render('./user/show', {user:user, userTypes: userTypes});
            }
        });
};


function save(req, res, next){
    User.findOne({_id:mongoose.Types.ObjectId(req.body._id)})
        .exec()
        .then((user, err) =>{
            if(err) {
                return res.redirect("/users");
            } else {
                user.name= req.body.name;
                user.email=req.body.email;
                user.userType=req.body.userType;

                if(req.body.password.length > 0){
                    if(req.body.password === req.body.confirmPassword){
                        user.generateHash(req.body.password);
                    }
                }

                if(!user.verifyValidEmail()){
                    return res.render('./user/show', {user:user, userTypes: userTypes});
                }

                user.isDuplicateEmailShow(req.body._id, (duplicate) => {
                    if(duplicate){
                        res.render('./user/show', {user:user,userTypes: userTypes});
                    } else {
                        user.save((err) => {
                            if(err) {
                                return res.render('./user/show', {user:user,userTypes: userTypes});
                            } else {
                                return res.redirect('/users');
                            }
                        });
                    }
                });

            }
        });
};

function changePass(req, res, next){
    let userId = req.params.id;
    User.findOne({_id:mongoose.Types.ObjectId(userId)})
        .exec()
        .then((user, err) =>{
        if(err) {
            return res.redirect('/users', 404);
        } else {
            return res.render('./user/changePass', {user:user});
        }
    });
};

function savePass(req, res, next){
    User.findOne({_id:mongoose.Types.ObjectId(req.body._id)})
        .exec()
        .then((user, err) =>{
            if(err) {
                return res.redirect("/users");
            } else {
                if(req.body.password === req.body.confirmPassword){
                    if(req.body.password.length > 0){
                        user.generateHash(req.body.password);
                        user.save((err) => {
                            if(err) {
                                return res.render('./user/changePass', {user:user});
                            } else {
                                return res.redirect('/users');
                            }
                        });
                    }else{
                        return res.render('./user/changePass', {user:user});
                    }
                }else{
                    return res.render('./user/changePass', {user:user});
                }
            }
        });
};

function deleteUser(req, res, next){
    User.remove({_id:mongoose.Types.ObjectId(req.body._id)}, function (err) {
        if(err){
            return res.redirect('/users');
        } else {
            return res.redirect('/users');

        }
    });
};

module.exports = {
    list,
    blank,
    create,
    show,
    save,
    changePass,
    savePass,
    deleteUser
};