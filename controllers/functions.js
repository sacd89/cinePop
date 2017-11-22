const express = require('express');
const mongoose = require('mongoose');
const Movie = require('../models/movie.js').Movie;
let Function = require('../models/function.js').Function;
const languageTypes = require('./../models/function.js').languageTypes;

function list(req, res, next){
    Function.find({})
        .populate('movie')
        .exec()
        .then((functions, err) =>{
        if(err) {
            return res.redirect('/', 404);
        } else {
            return res.render('./function/list', {functions:functions});
}
});
};

function blank(req, res, next){
    let newFunction = new Function();
    Movie.find({}).exec().then((allMovies, err) => {
        if(err){
            res.redirect('/', 404);
        }else{
            res.render('./function/blank', {function1: newFunction, languageTypes:languageTypes, movies: allMovies});
        }
    });
};

function create(req, res, next){
    console.log("ALV");
    console.log("REQ", req.body);
    let newFunction = new Function({
        movie: req.body.movie,
        language: req.body.languageType,
        date: req.body.date,
        hour: req.body.hour
    });

    newFunction.save((err) => {
        if(err) {
            console.log("EERR", err);
            Movie.find({}).exec().then((allMovies, err) => {
                if(err){
                    res.redirect('/', 404);
                }else{
                    res.render('./function/blank', {function1: newFunction, languageTypes:languageTypes, movies: allMovies});
                }
            });
        } else {
            return res.redirect('/functions');
        }
});
};

function show(req, res, next){
    let functionId = req.params.id;
    Function.findOne({_id:mongoose.Types.ObjectId(functionId)})
        .populate('movie')
        .exec()
        .then((function1, err) =>{
        if(err) {
            return res.redirect('/functions', 404);
        } else {
            Movie.find({}).exec().then((allMovies, err) => {
            if(err){
                res.redirect('/', 404);
            }else{
                res.render('./function/show', {function1: function1, languageTypes:languageTypes, movies: allMovies});
}
});
        }
});
};


function save(req, res, next) {
    Function.findOne({_id: mongoose.Types.ObjectId(req.body._id)})
        .exec()
        .then((function1, err) => {
        if(err) {
            return res.redirect("/functions");
        } else {
            function1.movie = req.body.movie;
            function1.language = req.body.languageType;
            function1.date = req.body.date;
            function1.hour = req.body.hour;

            function1.save((err) => {
                if(err) {
                    Movie.find({}).exec().then((movies, err) => {
                        if(err){
                            res.redirect('/', 404);
                        }else{
                            res.render('./function/show', {
                            function1: function1,
                            languageTypes: languageTypes,
                            movies: movies
                            });
                        }
                        });
                    } else {
                        return res.redirect('/functions');
                    }
                });
        }
    });
};

function deleteFunction(req, res, next){
    Function.remove({_id:mongoose.Types.ObjectId(req.body._id)}, function (err) {
        if(err){
            return res.redirect('/functions');
        } else {
            return res.redirect('/functions');

        }
    });
};

module.exports = {
    list,
    blank,
    create,
    show,
    save,
    deleteFunction
};