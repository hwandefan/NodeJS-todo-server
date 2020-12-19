const router = require('express').Router();
const { request, response } = require('express');
const Category = require('../models/Category')
const verify = require('./verifyToken')
const {categoryValidation} = require('../validation');


router.get('/', verify, async (request, response)=>{
    try {
        const category = await Category.find({userId: request.user._id});
        if(!category.length) response.send("No Categories here")
        else response.send(category)
    }catch(e) {
        response.status(400).send(e.error.details[0].message);
    }
})

router.post('/add', verify, async (request, response)=>{
    const validation = categoryValidation(request.body);
    if (!validation) response.send(validation.error.details[0].message)
    const category = new Category({
        name: request.body.name,
        userId: request.user._id
    })
    try{
        const savedCategory = await category.save()
        response.send({category: category._id})
    }catch(e){
        response.send("Invild Data")
    }
})

router.put('/edit/:id', verify, async (request, response)=>{
    const validation = categoryValidation(request.body)
    if(!validation) response.send(validation.error.details[0].message)
    try{
        const oneCategory = await Category.findOne({_id: request.params.id, userId: request.user._id})
        if(!oneCategory.name) return response.send("Something went wrong")
        else {
            oneCategory.name = request.body.name;
            oneCategory.save()
            response.send("Updated")
        }
    } catch (e){
        return response.send("Something went wrong")
    }
})

router.delete('/delete/:id',verify, async (request, response) =>{
    try{
        const categoryForDelete = await Category.findOne({_id: request.params.id, userId: request.user._id})
        categoryForDelete.delete()
        response.send("Deleted")
    }catch(e){
        return response.send("Something went wrong")
    }
})

module.exports = router