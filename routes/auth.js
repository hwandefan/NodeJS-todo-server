const router = require('express').Router();
const { request, response } = require('express');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation, editUserValidation} = require('../validation');
const { route } = require('./posts');
const verify = require('./verifyToken');
const { valid } = require('@hapi/joi');

router.post('/register', async (request, response) => {
    //Validate request into JSON answer
    const validation  = registerValidation(request.body)
    if (validation.error) response.send(validation.error.details[0].message)

    //Is User Exists in DB?
    const emailExist = await User.findOne({email: request.body.email})
    if(emailExist) return response.status(400).send('Email already exists')
    
    //HASH THE PASSWORD (BCRYPTJS)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(request.body.password,salt)

    // POST
        const user = new User({
            name: request.body.name,
            email: request.body.email,
            password: hashedPassword
        });
        try {
            const savedUser = await user.save()
            response.send({user: user._id})
        } catch(e) {
            response.status(400).send(e.error.details[0].message);
        }
});

router.post('/login', async (request, response) => {
    //Validate request into JSON answer
    const validation  = loginValidation(request.body)
    if (validation.error) response.send(validation.error.details[0].message)

    //Is User Exists in DB?
    const user = await User.findOne({email: request.body.email})
    if(!user) return response.status(400).send('Email or password wrong!')

    //Passwrod is correct
    const validPass = await bcrypt.compare(request.body.password, user.password)
    if(!validPass) return response.status(400).send('Email or password wrong!')

    const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN)
    response.header('auth-token',token).send(token)

})


router.put('/edit', verify, async (request, response)=>{
    //Validate request data
    const validation = editUserValidation(request.body)
    if (validation.error) response.send(validation.error.details[0].message)

    //Find Data of user
    const user = await User.findOne({_id: request.user._id})
    if(!user) return response.status(400).send('Something went wrong')

    //Change Data
    if(request.body.password){
        //HASH THE PASSWORD (BCRYPTJS)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(request.body.password,salt)
        user.password = hashedPassword
    }

    if(request.body.email) user.email = request.body.email
    if(request.body.name) user.name = request.body.name

    user.save();
    response.send("Updated")
})

router.get('/', verify, async(request, response)=>{
    try{
        const user = await User.findOne({_id: request.user._id})
        if(!user) response.send("Error")
        else response.send(user)   
    } catch(e) {
        response.status(400).send(e.error.details[0].message);
    }
})

module.exports = router