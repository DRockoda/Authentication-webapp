const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//Login
router.get('/login',(req,res) =>{
    res.render('login')
})

//Register
router.get('/register',(req,res) =>{
    res.render('register')
})

router.post('/register', (req,res) => {
    const { fname,lname,age,ph,address,occupation,email,password,password2 } = req.body

    let errors = []

    if(!fname || !lname || !age || !ph || !address || !occupation || !email || !password || !password2){
        errors.push({ msg:'Please fill in all fields'})
    }

    if(password.length < 6){
        errors.push({msg:'Password should be of atleast 6 letters'})
    }

    if(password !== password2){
        errors.push({msg:'Passwords do not match'})
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            fname,
            lname,
            age,
            ph,
            address,
            occupation,
            email,
            password,
            password2
        })
    } else {
        User.findOne({ email: email })
        .then(user => {
            if(user){
                errors.push({msg: 'Email already registered'})

                res.render('register',{
                    errors,
                    fname,
                    lname,
                    age,
                    ph,
                    address,
                    occupation,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    fname,
                    lname,
                    age,
                    ph,
                    address,
                    occupation,
                    email,
                    password,
                    password2
                })

                bcrypt.genSalt(10,(err,salt)=>
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err){
                            throw err
                        }
                        newUser.password = hash
                        newUser.save().then(user => {
                            req.flash('success_msg','You are now registered and can log in')
                            res.redirect('/users/login');
                        }).catch(err => alert('Something is not right,try again..'))
                    }))
            }
        })
    }
})

router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})

router.get('/logout',(req,res) =>{
    req.logout()
    req.flash('success_msg','Yu are logged out')
    res.redirect('/users/login')
})

module.exports = router