const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/user')
const Note = require('../model/notes')

const authUser = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        //console.log(email,password)
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).render('login',{
                receivedSignal:"Please check Email and Password",
                layout:'../views/layouts/blank'
            })
        }
        const isMatch =await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.status(401).render('login',{
                receivedSignal:"Invalid Password",
                layout:'../views/layouts/blank'
            })
          }
        
          const token = jwt.sign(
            {_id:user._id,username:user.username},
            process.env.JWT_SECRET,
            {expiresIn:'30d'}
          )
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
            secure: process.env.NODE_ENV === 'production' // Enable secure cookie in production
          });
          req.username = user.username
          req.userId = user._id;
          next();
    } catch (error) {
        console.error('Error authenticating user:', error);
    return res.status(500).render('login', {
      receivedSignal: "An error occurred. Please try again later.",
      layout: "../views/layouts/blank"
    });
    }
}

const canView = async(req,res,next)=>{
  try {
  // console.log(req)
  if(req.params.id){
    const note =await Note.findById(req.params.id);
    if(!note) return res.redirect('404');
    if(note.isShareable==true){
      return res.render('dashboard/view-note',{
        username:req.username,
        note,
        layout:'../views/layouts/dashboard'
    })
    }
    else return next()
  }
  else {
   return next()
  }
  } catch (error) {
   return res.redirect('/')
  }  
}


const verifyUser = async(req,res,next)=>{
  try {
    const token = req.cookies.token
  // console.log(token)
    if(!token){
      const locals={
        title:"CodeNote",
        description:"Free Notes App"
    }
      return res.render('index',{
        locals,
        layout:'../views/layouts/front-page'
       });
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(decoded._id)
    if(!user){
     return res.render('404');
    }
    req.userId = user._id;
    req.username = user.username
    next();
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
}

const verifyUserNote = async(req,res,next)=>{
  try {
  
    const token = req.cookies.token
  // console.log(token)
    if(!token){
      const locals={
        title:"CodeNote",
        description:"Free Notes App"
    }
      return res.render('index',{
        locals,
        layout:'../views/layouts/front-page'
       });
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(decoded._id)
    if(!user){
     return res.render('404');
    }
    const note  =await Note.findById(req.params.id);
    if(!note)res.redirect('/');
    if (note.userId.toString() !== user._id.toString()) {
      return res.redirect('/');
    }
    req.userId=user._id;
    req.username = user.username
    
    next();
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
}


module.exports = {authUser,verifyUser,canView,verifyUserNote}