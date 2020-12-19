//VALIDATION
const Joi = require('@hapi/joi')
const { request } = require('express')

const registerValidation = data =>{
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}

const loginValidation = data =>{
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}

const postValidation = data =>{
    const schema = Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required()
    })
    return schema.validate(data)
}

const editUserValidation = data =>{
    const schema = Joi.object({
        name: Joi.string().min(6),
        email: Joi.string().min(6).email(),
        password: Joi.string().min(6)
    })
    return schema.validate(data)
}

const editPostValidation = data =>{
    const schema = Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required(),
        date: Joi.date().required()
    })
    return schema.validate(data)
}

const categoryValidation = data =>{
    const schema = Joi.object({
        name: Joi.string().required()
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation
module.exports.editUserValidation = editUserValidation
module.exports.editPostValidation = editPostValidation
module.exports.categoryValidation = categoryValidation