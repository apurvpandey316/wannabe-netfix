const fetch = require('node-fetch')
const dotenv = require('dotenv')
const moviesController = require('./moviesController')

dotenv.config()

//this function renders both movies and tv shows
exports.tvShowsPopular = async(req, res) => {
    try{
        let showsPopular = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.api_key}`);
        let shows = await showsPopular.json();
        shows = shows.results.filter(show => show.original_language === 'en')
        const imageShow=[];
        shows.forEach(show => {
            imageShow.push({name: show.name, path: `https://image.tmdb.org/t/p/w300/${show.poster_path}`})
        })
        const movies = await moviesController.getPopularmovies();
        res.render('index',{tvshows: shows, images:imageShow, movies});
    } catch(e) {
        console.log(e);
        res.send(e);
    }
}



