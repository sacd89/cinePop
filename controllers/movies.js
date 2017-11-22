const express = require('express');
const mongoose = require('mongoose');
let Movie = require('../models/movie.js').Movie;
const classificationTypes = require('./../models/movie.js').classificationTypes;

function list(req, res, next){
    Movie.find({})
        .exec()
        .then((movies, err) =>{
        if(err) {
            return res.redirect('/', 404);
        } else {
            return res.render('./movie/list', {movies:movies});
        }
    });
};

function blank(req, res, next){
    let movie = new Movie();
    res.render('./movie/blank', {movie: movie, classificationTypes:classificationTypes});
};

function create(req, res, next){
    let movie = new Movie({
        name: req.body.name,
        duration: req.body.duration,
        classificationType: req.body.classificationType,
        linkPoster: req.body.linkPoster
    });

    movie.save((err) => {
        if(err) {
            return res.render('./movie/blank', {movie:movie, classificationTypes:classificationTypes});
        } else {
            return res.redirect('/movies');
        }
    });
};

function show(req, res, next){
    let movieId = req.params.id;
    Movie.findOne({_id:mongoose.Types.ObjectId(movieId)})
        .exec()
        .then((movie, err) =>{
        if(err) {
            return res.redirect('/movies', 404);
        } else {
            return res.render('./movie/show', {movie:movie, classificationTypes: classificationTypes});
        }
    });
};


function save(req, res, next) {
    Movie.findOne({_id: mongoose.Types.ObjectId(req.body._id)})
        .exec()
        .then((movie, err) => {
            if(err) {
                return res.redirect("/movies");
            } else {
                movie.name = req.body.name;
                movie.duration = req.body.duration;
                movie.classificationType = req.body.classificationType;
                movie.linkPoster = req.body.linkPoster;

                movie.save((err) => {
                    if(err) {
                        return res.render('./movie/show', {movie:movie, classificationTypes: classificationTypes});
                    } else {
                        return res.redirect('/movies');
                    }
                });
            }
        });
};

function deleteMovie(req, res, next){
    Movie.remove({_id:mongoose.Types.ObjectId(req.body._id)}, function (err) {
        if(err){
            return res.redirect('/movies');
        } else {
            return res.redirect('/movies');

        }
    });
};

module.exports = {
    list,
    blank,
    create,
    show,
    save,
    deleteMovie
};