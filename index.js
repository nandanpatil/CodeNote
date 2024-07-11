require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')

const app = express()
const PORT = 3000 || process.env.PORT
const dbconnect = require('./db/connect') 

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"))

// Static files
app.use(express.static('public'));

//Templating engine
app.use(expressLayouts)
app.set('layout','./layouts/main');
app.set('view engine','ejs');


const mainRouter = require('./routes/index')
const dashboardRouter = require('./routes/dashboard')
const userRouter = require('./routes/user')

//Routes
app.use('/',mainRouter)
app.use('/dashboard',dashboardRouter)
app.use('/auth',userRouter)



app.get('*',(req,res)=>{
    res.render('404');
})


app.listen(PORT,()=>{
    dbconnect();
    console.log(`Server running on port ${PORT}`)
})



