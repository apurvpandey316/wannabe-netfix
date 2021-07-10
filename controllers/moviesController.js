const fetch = require('node-fetch');

exports.searchMovies = async(req,res) => {
    if(! req.query.search){
        return res.redirect('/')
    }
    const name = req.query.search;
    try{
     let data = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.api_key}&query=${name}`)
     let movies = await data.json();
     movies = movies.results;
     let moviesImages = movies.map(movie => movie.poster_path?`https://image.tmdb.org/t/p/original/${movie.poster_path}`:`/images/not-found.jpg`);
    if(movies.length === 0){
        res.status(400).render('not_found');
    } else{
        res.status(200).render('searchMovies',{movies:movies, moviesImages})
    }
    movies = [];
    } catch (e) {
        console.log(e);
        return e;
    }
 }
 exports.getMovieById =  async(req,res) => {
    try{
        const movie_id = req.query['movie-id'];
    let movie = await fetch(`https://api.themoviedb.org/3/tv/${movie_id}?api_key=${process.env.api_key}&language=en-US`);
    movie = await movie.json();
    res.render('details',{item:movie, image:`https://image.tmdb.org/t/p/w780/${movie.poster_path}`})
    } catch(e) {
        console.log(e);
        res.send(e);
    }
}
exports.getPopularmovies = async(req,res) => {
    let movies = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.api_key}`);
    movies = await movies.json();
    movies = movies.results.filter(movie => movie.original_language === 'en');
    for(const movie of movies){
        let trailer = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.api_key}&language=en-US`);
        trailer = await trailer.json();
        trailer = trailer.results[2]||trailer.results[1]||trailer.results[0]||'NT';
        trailer = trailer !== 'NT'? `https://www.youtube.com/watch?v=${trailer.key}`:'NT';
        movie.trailer = trailer;
    }
    movies.forEach(movie => movie.img_path = `https://image.tmdb.org/t/p/w780/${movie.poster_path||movie.backdrop_path}`);
    return movies;
}