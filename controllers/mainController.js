const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie')

module.exports ={
   getMain: (req, res, next)=>{
      Movie.find({}).then((movies) => {
         return res.render('index', {title:'Movies', movies})
      }).catch(err=>res.status(400).json({message:'Oops! Something went wrong'}))
   },

   getAddMovie: (req,res) => {
      res.render('addmovie', {title: 'Add a movie'})
   },

   findMovie: (req,res) => {
      Movie.findOne({title: req.query.movie}).then(movie=>{
         if(movie) return res.render('foundMovie', {title:'Found Movie', movie})
         return res.status(400).json({message: 'Movie not found'})
      })
   },

   findByGenre: (req,res) => {
      Movie.find({genre:req.query.genre}).then(movies=>{
         console.log(movies)
         if(movies.length>0) return res.render('genreonly', {title:'Found Genre',genre:req.query.genre, movies})
         return res.status(400).json({message: `No movies found`})
      })
   },

   addMovie: (req,res) => {
      if (!req.body.title 
            || !req.body.rating 
            || !req.body.synopsis
            || !req.body.release_year
            || !req.body.genre
            || !req.body.director
            || !req.body.box_office
            || !req.body.poster) {
         return res.status(400).json({ message: 'All inputs must be filled' });
      }
      Movie.findOne({title: req.body.title}).then((movie) => {
         if(movie) return res.status(500).json({message:'Movie already in database'})

         const newMovie = new Movie()
         newMovie.title = req.body.title
         newMovie.rating = req.body.rating
         newMovie.synopsis = req.body.synopsis
         newMovie.release_year = req.body.release_year
         newMovie.genre = req.body.genre.toLowerCase().split(' ').join('').split(',')
         newMovie.director = req.body.director
         newMovie.box_office = req.body.box_office
         newMovie.poster = req.body.poster

         newMovie.save()
            .then(movie => {
               return res.status(200).json({ message: 'Movie added', movie: movie.title });
            }).catch(err => {
               return res
                  .status(500)
                  .json({ message: 'Movie wasn\'t added.', err });
            })
      }).catch(err => res.status(400).json({message:'Oops! Server error. Couldn\'t add movie'}))
   },

   updateMovie: (req,res)=>{
      Movie.findOne({title:req.params.title}).then(movie=>{
         if(movie===null){
            return res.status(200).json({message:"Movie not found"})
         }
            movie.rating = req.body.rating ? req.body.rating : movie.rating,
            movie.synopsis = req.body.synopsis ? req.body.synopsis : movie.synopsis,
            movie.release_year = req.body.release_year ? req.body.release_year : movie.release_year,
            movie.genre = req.body.genre 
            ? movie.genre.includes(req.body.genre)
               ? movie.genre
               : [...movie.genre, ...req.body.genre]
            : movie.genre,
            movie.director = req.body.director ? req.body.director : movie.director,
            movie.box_office = req.body.box_office ? req.body.box_office : movie.box_office,
            movie.poster = req.body.poster ? req.body.poster : movie.poster
            movie.save()
            res.status(200).json({message: `${req.params.title} updated`})
      }).catch(err=>res.status(400).json({message:'Oops! Something went wrong'}))
   },
   
   deleteMovie: (req,res) => {
      Movie.findOneAndDelete({title:req.params.title}).then(deleted=>{
         if(deleted===null)return res.status(400).json({message:"Movie not found"})
         res.status(200).json({message:`Movie ${deleted.title} deleted from database`})
      }).catch(err=> res.status(400).json({message:'Server error'}))
   }
}