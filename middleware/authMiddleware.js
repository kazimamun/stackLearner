const User = require('../models/User')

exports.bindUserWithRequest = () =>{
    return async (req, res, next) =>{
        if (!req.session.isLoggedIn) {
            return next()
        }

        try {
            let user = await User.findById(req.session.user._id)
            req.user = user
            next()
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
}

//protected routes
exports.isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect ('/auth/signin')
    }
    next()
}

//redirect logged user to dashboard if they want to visit signin/signup page
exports.isUnAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect ('/dashboard')
    }
    next()
}