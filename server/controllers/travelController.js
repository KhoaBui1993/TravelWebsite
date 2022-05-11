require('../models/database')
const { render, redirect } = require('express/lib/response');
const { session } = require('passport/lib');
const UserProfile = require('../models/UserProfile');
const  experiment= require('../models/countries');
const Category=require('../models/Category');
const Country= require('../models/countries');
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
        const newUser = new UserProfile({
          firstname: req.body.first_name,
          lastname: req.body.last_name,
          email: req.body.email,
          password: req.body.password,
        });
      
        await newUser.save();
        res.redirect('/');
    } catch (error) {
      res.json(error);
      res.redirect('/signup');
      
    }
  }
/**
 * End POST /signup
 * Submit user information
*/

exports.signinOnPost = async(req, res) => {
    
    username = req.body.email_input;
    password = req.body.password_input;
    var user = await UserProfile.findOne({email:username});
    if (user.password == password)
    {
        req.session.context=user.firstname;
        res.redirect('/');
    }      
    else
        res.redirect('/signin.ejs');

}


































/**
 * Hard code to insert continent
 * information. Because the continent is constant, so we don't need to worry and the change.
*/
// async function insertDummyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Africa",
//         "image": "africa-picture.jpg"
//       },
//       {
//         "name": "Asia",
//         "image": "asia-picture.jpg"
//       },

//       {
//         "name": "Europe",
//         "image": "europe-picture.jpg"
//       },

//       {
//         "name": "North America",
//         "image": "northamerica-picture.jpg"
//       },

//       {
//         "name": "South America",
//         "image": "sorthamerica-picture.jfif"
//       },
//       {
//         "name": "Australia",
//         "image": "africa-picture.jpg"
//       }
//     ]);
//   }catch (error){
//     console.log('error ',+error)
//   }
// }
// insertDummyCategoryData();

// async function insertDymmyCountryData(){
//     try {
//       await Country.insertMany([
//         { 
//           "countries": "China",
//           "information": `The word "China" has been used in English since the 16th century; however, it was not a word used by the Chinese themselves during this period. Its origin has been traced through Portuguese, Malay, and Persian back to the Sanskrit word Chīna, used in ancient India.[19] "China" appears in Richard Eden's 1555 translation[l] of the 1516 journal of the Portuguese explorer Duarte Barbosa.[m][19] Barbosa's usage was derived from Persian Chīn (چین), which was in turn derived from Sanskrit Cīna (चीन).[24] Cīna was first used in early Hindu scripture, including the Mahābhārata (5th century BCE) and the Laws of Manu (2nd century BCE).[25] In 1655, Martino Martini suggested that the word China is derived ultimately from the name of the Qin dynasty (221–206 BCE).[26][25] Although usage in Indian sources precedes this dynasty, this derivation is still given in various sources.[27] The origin of the Sanskrit word is a matter of debate, according to the Oxford English Dictionary.[19] Alternative suggestions include the names for Yelang and the Jing or Chu state.[25][28] The official name of the modern state is the "People's Republic of China" (simplified Chinese: 中华人民共和国; traditional Chinese: 中華人民共和國; pinyin: Zhōnghuá Rénmín Gònghéguó). The shorter form is "China" Zhōngguó (中国; 中國) from zhōng ("central") and guó ("state"),[n] a term which developed under the Western Zhou dynasty in reference to its royal demesne.[o][p] It was then applied to the area around Luoyi (present-day Luoyang) during the Eastern Zhou and then to China's Central Plain before being used as an occasional synonym for the state under the Qing.[30] It was often used as a cultural concept to distinguish the Huaxia people from perceived "barbarians".[30] The name Zhongguo is also translated as "Middle Kingdom" in English.[33] China (PRC) is sometimes referred to as the Mainland when distinguishing the ROC from the PRC`,
//           "author": "recipeemail@raddy.co.uk",
//           "thingtodo": [
//             "History",
//             "Food",
//             "Scence",
//           ],
//           "continent": "Asia", 
//           "image": "China.webp"
//         },
//         { 
//           "countries": "South Korea",
//           "information": `TThe name Korea derives from the name Goryeo. The name Goryeo itself was first used by the ancient kingdom of Goguryeo, which was considered a great power of East Asia during its time, in the 5th century as a shortened form of its name.[15][16][17][18] The 10th-century kingdom of Goryeo succeeded Goguryeo,[19][20] and thus inherited its name, which was pronounced by the visiting Persian merchants as "Korea".[21] The modern name of Korea, appears in the first Portuguese maps of 1568 by João vaz Dourado as Conrai [22] and later in the late 16th century and early 17th century as Korea (Corea) in the maps of Teixeira Albernaz of 1630.[23]

//           The kingdom of Goryeo became first known to Westerners when Afonso de Albuquerque conquered Malacca in 1511 and described the peoples who traded with this part of the world known by the Portuguese as the Gores.[24] Despite the coexistence of the spellings Corea and Korea in 19th century publications, some Koreans believe that Imperial Japan, around the time of the Japanese occupation, intentionally standardized the spelling on Korea, making Japan appear first alphabetically.[25][26][27]
          
//           After Goryeo was replaced by Joseon in 1392, Joseon became the official name for the entire territory, though it was not universally accepted. The new official name has its origin in the ancient kingdom of Gojoseon (2333 BCE). In 1897, the Joseon dynasty changed the official name of the country from Joseon to Daehan Jeguk (Korean Empire). The name Daehan (Great Han) derives from Samhan (Three Han), referring to the Three Kingdoms of Korea, not the ancient confederacies in the southern Korean Peninsula.[28][29] However, the name Joseon was still widely used by Koreans to refer to their country, though it was no longer the official name. Under Japanese rule, the two names Han and Joseon coexisted. There were several groups who fought for independence, the most notable being the Provisional Government of the Republic of Korea (대한민국 임시정부 / 大韓民國臨時政府).
          
//           Following the surrender of Japan, in 1945, the "Republic of Korea" (대한민국 / 大韓民國, IPA: ˈtɛ̝ːɦa̠nminɡuk̚, lit. 'Great Korean People's State'; listen) was adopted as the legal English name for the new country. However, it is not a direct translation of the Korean name.[30] As a result, the Korean name "Daehan Minguk" is sometimes used by South Koreans as a metonym to refer to the Korean ethnicity (or "race") as a whole, rather than just the South Korean state.[31][30] Conversely, the official name of North Korea in English, the "Democratic People's Republic of Korea", is a direct translation of the Korean name.
          
//           Since the government only controlled the southern part of the Korean Peninsula, the informal term "South Korea" was coined, becoming increasingly common in the Western world. While South Koreans use Han (or Hanguk) to refer to both Koreas collectively, North Koreans and ethnic Koreans living in China and Japan use the term Joseon instead.
          
//           `,
//           "author": "recipeemail@raddy.co.uk",
//           "thingtodo": [
//             "Night life",
//             "Food",
//             "Scence",
//           ],
//           "continent": "Asia", 
//           "image": "south_korea.jpg"
//         },
//       ]);
//     } catch (error) {
//       console.log('err', + error)
//     }
//   }
// insertDymmyCountryData();