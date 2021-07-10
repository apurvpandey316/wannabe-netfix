const User = require('./../models/Usermodel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fetch = require('node-fetch');


dotenv.config();

exports.getMyList = (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token ,process.env.JWT_SECRET,async (err, jwt) => {
            try{
                if(err){
                    console.log(err.message);
                    res.redirect('/login');
                } else {
                    const user = await User.findOne({_id:jwt.id})
                    res.render('profile', {user});
                }
            } catch(e){
                console.log(e);
                res.send('error');
            }
        })
    } else {
        res.redirect('/login');
    }
}
exports.addToList =  async (req,res) => {
    [type,id]=(req.body.id).split('-');
    let content = await fetch (`https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.api_key}`)
    content = await content.json();
    const entity = {
        title: (content.title?content.title:content.original_name),
        overview:content.overview,
        year:(content.release_date?content.release_date.split('-')[0]:content.first_air_date.split('-')[0]),
        rating: content.vote_average,
        img_path: (content.poster_path?`https://image.tmdb.org/t/p/w780/${content.poster_path}`:`https://image.tmdb.org/t/p/w780/${content.poster_path}`)
    }
    token = req.cookies.jwt;
    let user = null;
    // console.log(res.locals);
    jwt.verify(token, process.env.JWT_SECRET, async (err, id) => {
        if(err){
            console.log(err);
            res.send(err);
        } else {
            const user_id = id.id;
            user = await User.findById(user_id)
            user.list.push(entity);
            await user.save();
            res.render('profile', {user});
        }
    });
}
exports.deleteFromList =  (req,res) => {
    token = req.cookies.jwt;
    const item = req.body.item;
    let user = null;
    // console.log(res.locals);
    jwt.verify(token, process.env.JWT_SECRET, async (err, id) => {
        if(err){
            console.log(err);
            res.send(err);
        } else {
            const user_id = id.id;
            user = await User.findById(user_id)
            user.list = user.list.filter(obj => obj.id !== item);
            await user.save();
            res.redirect('/myList');
        }
    });
}