const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const Flash = require('../utility/Flash')

router.get('/validator', (req, res, next) => {
    console.log(Flash.getMessage(req))
    
    res.render('playground/signup', { title: 'validator playground' })
})

router.post('/validator',
    [
        check('username')
            .not()
            .isEmpty()
            .withMessage('Username not empty')
            .isLength({ max: 15 })
            .withMessage('Username can not be greater then 15 character').trim(),
        check('email')
            .isEmail()
            .withMessage('please provide a valid email').normalizeEmail(),
        check('password').custom(value=>{
            if(value.length < 5 ){
                throw new Error('password must be greater then 5 charecter.')
            }
            return true;
        }),
        check('confirmPassword').custom((value,{req})=>{
            if(value !== req.body.password){
                throw new Error(`password doesn't matched`)
            }
            return true;
        })
    ],
    (req, res, next) => {
        let errors = validationResult(req)

        if(!errors.isEmpty()) {
            req.flash("failed", 'Ther is some Error!')
        } else {
            req.flash('success', 'There is no Error!')
        }

        res.redirect('/playground/validator')
    })
module.exports = router