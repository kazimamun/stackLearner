const { body } = require('express-validator')

const User = require('../../models/User')

module.exports = [
    body('username')
        .isLength({min:2, max:15}).withMessage('username must be 2 to 15 character')
        .custom( async username =>{
            let user = await User.findOne({username})
            if(user){
                return Promise.reject('Username Already Exists.')
            }
        })
        .trim()
    ,
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .custom( async email =>{
            let user = await User.findOne({email})
            if(user){
                return Promise.reject('Email Already Exists.')
            }
        })
        .normalizeEmail()
    ,
    body('password')
        .isLength({min: 5}).withMessage('Password Must be greater than 5 Character')
    ,
    body('confirmPassword')
        .custom((confirmPassword, {req})=>{
            if (confirmPassword !== req.body.password){
                throw new Error('password does not matched.')
            }
            return true
        }
    )
]