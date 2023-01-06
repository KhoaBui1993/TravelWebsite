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
         require: true
    },
    password:{
        type:String,
        require: true
    }
},{timestamps: true}) ;
UserSchema.index({email: 'text',password: 'text'});
module.exports =mongoose.model('UserProfile', UserSchema);