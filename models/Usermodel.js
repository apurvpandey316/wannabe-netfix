const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true, 'This username is already taken'],
        required:[true, 'Please provide a username']
    },
    email:{
        type:String,
        required:[true, 'Please provide a email'],
        unique:true,
        validate:[validator.isEmail, 'Please provide a valid email']
    },
    password:{
        type:String,
        required:[true, 'Please provide a password']
    },
    confirmPassword:{
        type:String,
        validate: {
            validator: function(el) {
              return el === this.password;
            },
            message: 'Passwords are not the same!'
          }
    },
    list: [{
        title:String,
        overview:String,
        year:Number,
        rating:Number,
        img_path:String

    }]
})

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10)
    this.confirmPassword = undefined;
    next();
})
const User = mongoose.model('User', userSchema);

module.exports = User;