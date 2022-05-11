const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname:{
        type: String,
        require: 'This field is required'
    },
    lastname:{
        type: String,
        require: 'This field is required'
    },
    email:{
        type: String,
        require: 'This field is required'
    },
    password:{
        type:String,
        require: 'This field is required'
    },
}) ;
UserSchema.index({email: 'text',password: 'text'});
module.exports =mongoose.model('UserProfile', UserSchema);