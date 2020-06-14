const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const Flash = require('../utility/Flash')

const User = require('../models/User')
const errorFormetter = require('../utility/validationErrorFormattor')

exports.signUpGetController = (req, res, next) => {
    res.render('pages/auth/signup', 
        {
            title: 'Create a new account',
            error: {},
            value: {},
            flashMessage: Flash.getMessage(req)
        }
    )
}

exports.signUpPostController = async (req, res, next) => {

    let {username, email, password} = req.body

    let errors = validationResult(req).formatWith(errorFormetter)

    
    if(!errors.isEmpty()){
        req.flash('failed', 'Please Check Your Form')
        return res.render('pages/auth/signup', 
            {
                title: 'Create a new account', 
                error: errors.mapped(), 
                value: {username, email, password},
                flashMessage: Flash.getMessage(req)
            }
        )
    }

    try {
        let hashedPass = await bcrypt.hash(password, 10)
    
        let user = new User({
            username,
            email,
            password : hashedPass
        })

        await user.save()   
        req.flash('success', 'User Created Successfully')     
        res.redirect('/auth/signin')
    } catch (err) {
        console.log(err)
        next(err)
    }
}

exports.signInGetController = (req, res, next) => {
    res.render('pages/auth/signin', 
        {
            title: 'login to your account', 
            error:{},
            flashMessage: Flash.getMessage(req)
        }
    )
}

exports.signInPostController = async (req, res, next) => {
    let {email, password} = req.body

    let errors = validationResult(req).formatWith(errorFormetter)

    
    if(!errors.isEmpty()){
        req.flash('failed', 'Please Check Your Form')
        return res.render('pages/auth/signin', 
            { 
                title: 'login to your account', 
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req)
            }
        )
    }

    try {
        let user = await User.findOne({email})
        if (!user){
            req.flash('failed', 'Please Provide Valid Credentials')
            return res.render('pages/auth/signin', 
                { 
                    title: 'login to your account', 
                    error: {},
                    flashMessage: Flash.getMessage(req)
                }
            )
        }

        let match = await bcrypt.compare(password, user.password)
        if(!match) {
            req.flash('failed', 'Please Provide Valid Credentials')
            return res.render('pages/auth/signin', 
                { 
                    title: 'login to your account', 
                    error: {},
                    flashMessage: Flash.getMessage(req)
                }
            )
        }

        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err => {
            if (err) {
                console.log(err)
                return next(err)
            }
            req.flash('success', 'Successfully Logged In')
            res.redirect('/dashboard')
        }) 
    } catch (err) {
        console.log(err)
        next(err)
    }
}

exports.signOutController = (req, res, next) => {
    req.session.destroy(err =>{
        if (err) {
            console.log(err)
            return next(err)
        }
        req.flash('success', 'Successfully Logout')
        return res.redirect('/auth/signin')        
    })
}