const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname:{
        type: String,
        require: true
    },
    lastname:{
        type: String,
        require: true
    },
    email:{
         type: String,
         require: true,
         unique: true
    },
    password:{
        type:String,
        require: true
    },
    picture:{
        type:String,
        default: "blank-profile-picture-gf48cd313e_640.png"
    } 
},{timestamps: true}) ;
// UserSchema.index({email: 'text',password: 'text'});
module.exports =mongoose.model('UserProfile', UserSchema);