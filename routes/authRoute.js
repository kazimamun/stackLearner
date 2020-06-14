const router = require('express').Router()

const signupValidator = require('../validators/auth/signupValidator')
const loginValidator = require('../validators/auth/loginValidator')

const {isUnAuthenticated} = require('../middleware/authMiddleware')

const {
    signUpGetController,
    signUpPostController,
    signInGetController,
    signInPostController,
    signOutController
} = require('../controllers/authController')


router.get('/signup', isUnAuthenticated, signUpGetController)
router.post('/signup', isUnAuthenticated, signupValidator, signUpPostController)

router.get('/signin', isUnAuthenticated, signInGetController)
router.post('/signin', isUnAuthenticated, loginValidator, signInPostController)

router.get('/signout', signOutController)

module.exports = router