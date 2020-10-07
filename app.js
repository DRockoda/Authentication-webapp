const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const db = require('./config/keys').MongoURI
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

require('./config/passport')(passport)

mongoose.connect( db, { useNewUrlParser:true , useCreateIndex: true , useUnifiedTopology: true} 
    ).then(() =>
        console.log('mongodb connected...')
    ).catch((e)=>
        console.log(e)
    )

app.use(expressLayouts)
app.set('view engine','ejs')

app.use(express.urlencoded( { extended:false } ))

app.use(session({
    secret: 'omen',
    resave:true,
    saveUninitialized:true
}))

app.use(passport.initialize());
app.use(passport.session());



app.use(flash())

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

app.use('/',require('./routes/index.js'))
app.use('/users',require('./routes/users.js'))

const PORT = process.env.PORT || 3000

app.listen(PORT,console.log(`server is up on port ${PORT}`))