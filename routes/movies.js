const express = require('express');
const router = express.Router();
const movieController = require('./../controllers/moviesController')

const app = express();

app.use(express.urlencoded({extended: true}));

router.get('/search',movieController.searchMovies);
router.get('/:id',movieController.getMovieById);
module.exports = router;