const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')

//import routes
const authRoutes = require('./routes/authRoute')
const dashboardRoutes = require('./routes/dashboardRoute')

//playground routes
// const playgroundRoutes = require('./playground/validator')

//import middlware
const {bindUserWithRequest} = require('./middleware/authMiddleware')
const setLocals = require('./middleware/setLocals')

const MONGODB_URI = 'mongodb+srv://firstDb:firstDb123@cluster0-g1juc.mongodb.net/exp-blog?retryWrites=true&w=majority'
//connect database for session
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2
});


const app = express()

//setup view engine
app.set('view engine', 'ejs')
app.set('views', 'views')

//Middleware array
const middleware = [
    morgan('dev'),
    express.static('public'), // this line is for share folder for everyone
    express.urlencoded({extended: true}),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    bindUserWithRequest(),
    setLocals(), //this middleware must be bellow of binduser middleware
    flash()
]

app.use(middleware)

app.use('/auth', authRoutes)
app.use('/dashboard', dashboardRoutes)

// app.use('/playground', playgroundRoutes)

app.get('/', (req, res) =>{
    res.json({
        message:'hello world!'
    })
})



const PORT = process.env.PORT || 8080
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('database connected')
        app.listen(PORT, ()=>{
            console.log(`server is running on port: ${PORT}`)
        })
    }) 
    . catch( err =>{
       return console.log(err)
    })

