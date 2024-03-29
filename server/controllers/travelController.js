require('../models/database')
const { render, redirect } = require('express/lib/response');
const { session } = require('passport/lib');
const UserProfile = require('../models/UserProfile');
const Category=require('../models/Category');
const Country= require('../models/countries');
const jwt=require('jsonwebtoken');
const bcrypt =require('bcryptjs');
const saltRounds=10;
const createToken = (id) =>{
  return jwt.sign({id},`${process.env.SECRET_KEY}`,{expiresIn: '1d'})
}

/**
 * GET/
 * Homepage
 */
exports.homepage = async(req, res) => {
  try{
    const limitNumber =5;
    const categories= await Category.find({}).limit(limitNumber);
    var context=req.session.context;

    const latest = await Country.find({}).sort({_id: -1}).limit(limitNumber);
    
    const asia= await Country.find({'continent':'Asia'}).limit(limitNumber);
    const australia= await Country.find({'continent':'Australia'}).limit(limitNumber);
    const africa= await Country.find({'continent':'Africa'}).limit(limitNumber);
    const northamerica= await Country.find({'continent':'NorthAmerica'}).limit(limitNumber);
    const southamerica= await Country.find({'continent':'SouthAmerica'}).limit(limitNumber);
    const europe= await Country.find({'continent':'Europe'}).limit(limitNumber);
    const country= {latest,asia,australia,africa,northamerica,southamerica,europe}; 
    res.render('index',{ title:'Travel Blog - Home', categories,country,context});

  }catch (error){
    res.status(100).send({message: error.message || "Error Homepage!"})
  }
}
/**
 * GET/
 * Categories
 */
 exports.exploreCategories = async(req, res) => {
  try{
    const limitNumber =20;
    const categories= await Category.find({}).limit(limitNumber);
    var context=req.session.context;
    res.render('categories',{ title:'Travel Blog - Categories', categories,context});

  }catch (error){
    res.status(200).send({message: error.message || "Error exploreCategories!"})
  }
}
exports.signin = async(req, res) => {
    res.render('signin',{title: 'Sign-In'});
 
}
exports.signup = async(req, res) => {
    res.render('signup',{title: 'Sign-up'});
}

exports.Africa = async(req, res) => {
  const africa= await Country.find({'continent':'Africa'});
  res.render('Africa',{title: 'Africa',africa});
}
exports.Asia = async(req,res) => {
  const asia= await Country.find({'continent':'Asia'});
  res.render('Asia',{title: 'Asia',asia});
}
exports.Australia = async(req,res) => {
  const australia= await Country.find({'continent':'Australia'});
  res.render('Australia',{title: 'Australia',australia});
}
exports.Europe = async(req,res) => {
  const europe= await Country.find({'continent':'Europe'});
  res.render('Europe',{title: 'Europe',europe});
}
exports.NorthAmerica = async(req,res) => {
  const northamerica= await Country.find({'continent':'NorthAmerica'});
  res.render('NorthAmerica',{title: 'NorthAmerica',northamerica});
}
exports.SouthAmerica = async(req,res) => {
  const southamerica= await Country.find({'continent':'SouthAmerica'});
  res.render('SouthAmerica',{title: 'SouthAmerica',southamerica});
}
exports.explorelatest = async(req,res) => {
  const latestcountry = await Country.find({}).sort({_id: -1}).limit(1);
  res.render('ExploreLatest',{title: 'ExploreLasted',latestcountry});
}

exports.exploreCountry= async(req,res) => {
  try{
  let countryId= req.params.id;
  const countryselect = await Country.findById(countryId);
  res.render('country',{title: 'Country',countryselect});
  }catch (error){
  res.status(500).send({message: error.message || "Error Homepage!"})
  }
}
/**
 * GET /submit-country
 * Submit country
*/
exports.submitexperiment = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');    
    res.render('submit-experiment', { title: 'Travel Blog - Submit City', infoErrorsObj, infoSubmitObj  } );
  }
  
/**
 * * POST /submit-Country
 * Submit country
*/
exports.submitexperimentOnPost = async(req, res) => {
  
    try {
      let user;
        const token = req.cookies.access_token;
      if (token){
        const decoded = jwt.verify(token, `${process.env.SECRET_KEY}`);
        user = await UserProfile.findById(decoded.id);
      }
        let imageUploadFile;
        let uploadPath;
        let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }

      const newCountry = new Country({
        countries: req.body.country,
        place:req.body.place,
        information: req.body.information,
        pros: req.body.pros,
        cons: req.body.cons,
        recommendedactivities: req.body.recommendedActivities,
        continent: req.body.Continent,
        image: newImageName,
        author: user.firstname,
        author_id: user._id
      });
      await newCountry.save();
      req.flash('success_alert', 'Your experience has been added.')
      res.redirect('/');
    } catch (error) {
      req.flash('error', err.message)
      res.redirect('/submit-experiment');
    }
  }
  
  
/**
 * Start POST /signup
 * Submit user information
*/
exports.signupOnPost = async(req, res) => {
    try {
      if ( await  UserProfile.findOne({email: req.body.email}))
      {
        req.flash('error','Email already used, Please login!');
        res.redirect('/signin');
      }
      else
      {
        const hashPassword = await bcrypt.hash(req.body.password,saltRounds);
        const newUser = new UserProfile({
          firstname: req.body.first_name,
          lastname: req.body.last_name,
          email: req.body.email,
          password: hashPassword,
        });
       
        await newUser.save();
        req.flash('success_alert','Successfully registered, Please login!');
        res.redirect('/signin');
      }
    } catch (error) {
      
      req.flash('error','Cannot registered, Please try again!');
      res.redirect('/signup');
      
    }
  }
/**
 * End POST /signup
 * Submit user information
*/

exports.signinOnPost = async(req, res) => {
    try{
      username = req.body.email_input;
      password = req.body.password_input;
      const user = await UserProfile.findOne({ email: username});
      if (user) {
        const cmp = await bcrypt.compare(password, user.password);
        if (cmp) {
          const token =createToken(user._id);
          res.cookie('access_token',token,{
            httpOnly: true
          })
          req.flash('success_alert','Successfully login!');
          res.redirect("/");
        } else {
          req.flash('error','Wrong password or Username. Please try again!');
          res.redirect("/signin");
        }
      } else {
        req.flash('warning','Can not find username. Please create an account!');
        res.redirect("/signup");
      }
    } catch (err){
      req.flash('error',err.message);
      res.redirect('/signin')
    }
    
    }
exports.logout_get = (req,res) => {
  res.cookie('access_token','',{maxAge : 1});
  req.flash('success_alert','You has been log out.')
  res.redirect('/');
}
exports.User_Profile = async(req,res) =>{
  userID= req.params.id;
  const result= await Country.find({'author_id':req.params.id});
  const user_comment = await Country.find({'User_id_comment' : req.params.id})
  res.render('User_Profile', { title: 'User_Profile',result,user_comment} );
};

/**
 * Start POST /User_comment
 * User add comment
*/
exports.User_commentOnpost = async (req, res) =>{

  var commentObj= {"User_id_comment": req.body.user_id,"User_picture_comment" : req.body.user_picture_comment,"User_name_comment":req.body.username, "User_comment":req.body.comments ,"createAt": Date.now()};
  Country.findOneAndUpdate(
    {_id: req.body.post_id},
    {$push: {comment : commentObj}},
    function (error, success) {
      if (error) {
        req.flash('error','Can not publish your comment, Please try again!')
      } else {
        req.flash('success_alert', success.message)
      }
  });
  res.redirect('/country/'+req.body.post_id);
}
exports.delete_commentOnpost = async (req,res) =>{
  const comment_find = await Country.findById(req.body.post_id)
  if (comment_find) {
    comment_find.comment.pull(req.body.comment_id)
    await comment_find.save()
    req.flash('success_alert','Comment delete successful!')
  } else {
    req.flash('error','Cannot delete comment, please try again!')
  }
  res.redirect('/country/'+req.body.post_id);
}

exports.edituserprofileOnpost = async (req,res) =>{
  let avatarUploadFile;
  let avataruploadPath;
  let newavatarName;
  if(!req.files || Object.keys(req.files).length === 0){
    console.log('No Files where uploaded.');
  } else {
    avatarUploadFile = req.files.profile_picture;
    newavatarName = Date.now() + avatarUploadFile.name;
    avataruploadPath = require('path').resolve('./') + '/public/User_picture_profile/' + newavatarName;
    avatarUploadFile.mv(avataruploadPath, function(err){
      if(err) return res.redirect('/');
    })
  }
  UserProfile.findOneAndUpdate(
    {_id: req.params.id},
    { picture : newavatarName},
    function (error, success) {
      if (error) {
        req.flash('error','Unable to change your profile. Please try again')
      } else {
        req.flash('success_alert','Your profile has been updated.')
      }
  });

  res.redirect('/User_Profile/'+req.params.id)
}
exports.randomPlace = async (req,res) => {
  const random =  await Country.aggregate([{ $sample: { size: 1 } }]);
  res.redirect('/country/'+ random[0]._id);
}