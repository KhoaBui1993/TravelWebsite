const express = require('express');
const router = express.Router();
const travelController = require ('../controllers/travelController');

//App Routes
router.get('/',travelController.homepage);
router.get('/signin',travelController.signin);
router.post('/signin',travelController.signinOnPost);
router.get('/signup',travelController.signup);
router.post('/signup',travelController.signupOnPost);
router.get('/logout', travelController.logout);
router.get('/submit-experiment', travelController.submitexperiment);
router.post('/submit-experiment', travelController.submitexperimentOnPost);
router.get('/categories',travelController.exploreCategories);

router.get('/Asia',travelController.Asia);
router.get('/NorthAmerica',travelController.NorthAmerica);
router.get('/SouthAmerica',travelController.SouthAmerica);
router.get('/Europe',travelController.Europe);
router.get('/Australia',travelController.Australia);
router.get('/Africa',travelController.Africa);
router.get('/explorelatest',travelController.explorelatest);

router.get('/country/:id',travelController.exploreCountry);



module.exports = router;