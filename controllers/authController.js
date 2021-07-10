const User = require('./../models/Usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

const age = 10*60*60*24;

//check is user is logged in 
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{expiresIn: age})
}
exports.checkUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async(err, user_id) => {
            if(err){
                console.log(err.message);
                res.locals.loggedIn = null;
                next();
            } else {
                let user = await User.findById(user_id.id);
                res.locals.loggedIn = user
                next();
            }
        })
    } else {
        res.locals.loggedIn = null
        next();
    }
}
exports.getUser = async(req,res) => {
    const user = req.user
    res.render('profile', {user:user})
}
exports.loginorSignup = async(req,res,next) => {
    if(req.body.type === 'signUp'){
        try{
            const newUser = await User.create({
                username: req.body.username,
                email:req.body.email,
                password:req.body.password,
                confirmPassword: req.body.confirmPassword
            })
            const user = await newUser.save();
            //here is creation of token and assigning it to a cookie
            const token =createToken(user._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge:age*1000})

            req.user = await User.findById(user)
            req.userId = req.user._id
            next();
        } catch(e){
            console.log(e);
            res.send(e.message);
        }
    } else {
        const {username, password} = req.body;
        if(!username||!password){
            res.redirect('/login')
        }
        const user = await User.findOne({username:username})
        if(!user){
            res.send('Username or PassWord incorrect')
        }
        if(await bcrypt.compare(password, user.password)){
            res.send('Username or Password incorrect');
        }
        const token =createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge:age*1000})
        req.user = user;
        next();
    }
}
exports.logout = async (req,res) => {
    res.cookie('jwt', '', {httpOnly: true, maxAge:1})
    res.redirect('/');
}