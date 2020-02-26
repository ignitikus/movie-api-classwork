const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie')

const {
  getMain,
  getAddMovie,
  findMovie,
  findByGenre,
  addMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/mainController')


router.get('/', getMain);
router.get('/getmovie', findMovie)
router.get('/filteredbygenre', findByGenre)
router.get('/addmovie', getAddMovie)
router.post('/addmovie', addMovie)
router.put('/updatemovie/:title', updateMovie)
router.delete('/deletemovie/:title', deleteMovie)


module.exports = router;
