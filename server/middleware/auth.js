const jwt = require('jsonwebtoken');
const UserProfile = require('../models/UserProfile');
const requireAuth = (req,res,next) =>{
    const token = req.cookies.access_token;
    // check json web token exists is verified
    if (token){
        jwt.verify(token,`${process.env.SECRET_KEY}`,(err,decodedToken)=>{
            if (err)
            {
                console.log(err.message);
                res.redirect('/signin');
            }else{
                next();
            }
        });

    }
    else{
        res.redirect('/signin');
    }
}
//check current user
const checkUser = (req,res,next) =>{
    const token = req.cookies.access_token;
    if (token){
        jwt.verify(token,`${process.env.SECRET_KEY}`,async (err,decodedToken)=>{
            if (err)
            {
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                let user = await UserProfile.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user=null;
        next()
    }
}
module.exports = {requireAuth,checkUser};