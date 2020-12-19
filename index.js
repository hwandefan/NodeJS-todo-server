const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')

//Import Routes (returning function with links)
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const categoryRoute = require('./routes/categories')

dotenv.config()

//Conect To DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Cennected To DB')
);

var corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

//Middleware
app.use(express.json());
//Routes Middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/categories', categoryRoute)

app.listen(3000,() => console.log('Server has started...'));


//REACT SCROLL MENU WITH CATEGORIES FOR TASKS AND THEN OTHER COOL STUFF.

//IMAGE SCREEN IN FOLDER WITH INTERFACE TO IMPORT TO REACT
// OF COURSE WITH REACT YOU NEED TO HIDE TASKS WITH COMPLETED FLAG AND ETC....
// IF NOT, THEN JUST SORT IT IN NODE.js, BUT better will be with react (I hope......)