const express = require('express')
const router  = express.Router();
const mainController = require('../controllers/mainController')
const {verifyUser} = require('../middlewares/authUser')
router.get('/',verifyUser,mainController.homePage);

router.get('/about',mainController.aboutPage);

module.exports = router

