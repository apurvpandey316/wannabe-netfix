// const nightModeButton = document.querySelector('#checker');
const slider = document.querySelector('.slider');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const moviesPopularData = document.querySelectorAll('.moviesPopularData');
let moviesPopular = [];
let counter = 0;
let currSlider = null;
let currElement = null;
// let element = null;
// let currSlider = document.querySelector('.currSlider')
moviesPopularData.forEach(movie => {
    let element = `<div class="currSlider">
    <div class = "movie-image" style="background-image: url(${movie.getAttribute('data-posterImage')})">
    </div>
    <div class = "movie-data">
    <div class = "movie-title"><h2>${movie.getAttribute('data-name')}</h2></div>
    <div class = "movie-overview "><h4 class = "inline">Overview:</h4><h5 class = "inline">${movie.getAttribute('data-overview')}</h5></div>
    <div class = "movie-year "><h4 class = "inline">Year:</h4><h3 class = "inline">${movie.getAttribute('data-year')}</h3></div>
    <div class = "movie-rating"><h4 class = "inline">Rating:</h4><h3 class = "inline">${movie.getAttribute('data-rating')}/10</h3></div>
    <form action="/myList" method="post">
        <input type="search" name="id" id="data" value="movie-${movie.getAttribute('data-id')}" style="display: none;">
        <div class = "movie-links"><a href =${movie.getAttribute('data-trailer')} class="movie-link-button">Watch Trailer</a><button type="submit" class="movie-link-button left-margin">Add to List</button></div>
    </form>
    </div>
</div>`
        // console.log(movie);
        moviesPopular.push(element);
})
//data on the slider after loading of the page
slider.insertAdjacentHTML("beforeend", moviesPopular[0]);

const changeSliderContent =  function(){
    slider.removeChild(slider.lastChild);
    slider.insertAdjacentHTML("beforeend", moviesPopular[counter]);
}
const leftButtonClick = function(){
    counter--;
    if(counter<0)
    counter = moviesPopular.length - 1 ;
    changeSliderContent();
}
const rightButtonClick = function(){
    counter++;
    if(counter > moviesPopular.length - 1)
    counter = 0;
    changeSliderContent();
}
leftButton.addEventListener('click', leftButtonClick);
rightButton.addEventListener('click', rightButtonClick);
//implement night mode later
// nightModeButton.addEventListener('click', nightMode);

