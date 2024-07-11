const express = require('express')
const router  = express.Router();
const userController = require('../controllers/userController')
const {authUser, verifyUser} = require('../middlewares/authUser')

//Just show the login form
// auth/
router.get('/',userController.loginRender);

//Now register the user => /auth/signup
router.post('/signup',userController.registerUser);

//Login the user and render dashboard=>  /auth/login
router.post('/login', authUser, userController.loggedIn);

router.get('/logout',verifyUser,userController.logoutUser)



module.exports = router;