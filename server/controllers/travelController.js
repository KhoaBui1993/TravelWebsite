require('../models/database')
const { render, redirect } = require('express/lib/response');
const { session } = require('passport/lib');
const UserProfile = require('../models/UserProfile');
const  experiment= require('../models/countries');
const Category=require('../models/Category');
const Country= require('../models/countries');
const jwt=require('jsonwebtoken');
const bcrypt =require('bcryptjs');

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
    const northamerica= await Country.find({'continent':'North America'}).limit(limitNumber);
    const southamerica= await Country.find({'continent':'South America'}).limit(limitNumber);
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
exports.logout = async(req, res)=> 
{
    context=null;
    res.render('index',{context: context});
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
        information: req.body.information,
        author: req.body.author,
        thingtodo: req.body.thingtodo,
        continent: req.body.Continent,
        image: newImageName
      });
      
      await newCountry.save();
  
      //  req.flash('/', 'Recipe has been added.')
      res.redirect('/');
    } catch (error) {
      // res.json(error);
    //   req.flash('infoErrors', error);
      console.log(error)
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
        res.status(200).json('New User create Successful');
        res.redirect('/signin');
      }
    } catch (error) {
      req.flash('error','Cannot registered, Please try again!');
      res.status(201).json(err.message);
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
          const payload = {
            id: user._id,
          }
          const token =jwt.sign(payload,`${process.env.SECRET_KEY}`,{ expiresIn: '1d'});
          res.cookie('access_token',token,{
            httpOnly: true
          })
          res.redirect("/");
        } else {
          res.redirect("/signin");
        }
      } else {
        res.redirect("/signup");
      }
    } catch (err){
      req.flash('error',err.message);
      res.redirect('/signin')
    }
    
    }

  exports.User_Profile = async(req,res) =>{
    res.render('User_Profile', { title: 'User_Profile'} );
  }