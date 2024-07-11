
const homePage =async (req,res)=>{
    res.redirect('/dashboard')
}


 const aboutPage= async(req,res)=>{
    const locals={
        title:"Notes - About",
        description:"Free Nodejs Notes App"
    }
    return res.render('about',locals);
}


module.exports = {homePage,aboutPage}