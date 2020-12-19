const router = require('express').Router();
const { request, response } = require('express');
const verify = require('./verifyToken')
const { postValidation, editPostValidation } = require('../validation');
const Post = require('../models/Post');
const { valid } = require('@hapi/joi');

router.get('/', verify, async (request, response) =>{
    try{
        const post = await Post.find({userId: request.user._id})
        if(!post.length) response.send("No Posts here")
        else response.send(post)   
    } catch(e) {
        response.status(400).send(e.error.details[0].message);
    }
})

router.post('/add', verify, async (request, response)=>{

    //Validation
    const validation = postValidation(request.body)
    if (!validation) response.send(validation.error.details[0].message)
    let post;
    //new post
    if(request.body.date){
        post = new Post({
            title: request.body.title,
            text: request.body.text,
            date: request.body.date,
            category: request.body.category,
            userId: request.user._id
        });
    }
    else{
        post = new Post({
            title: request.body.title,
            text: request.body.text,
            category: request.body.category,
            userId: request.user._id
        });
    }

    try {
        const savedPost = await post.save()
        response.send({post: post._id})
    } catch(e) {
        //response.status(400).send(e.error.details[0].message);
        response.send("Invild Data")
    }
})

router.get('/id/:id', verify, async (request, response) =>{
    try{
        const onePost = await Post.find({_id: request.params.id, userId: request.user._id})
        if(!onePost.length) response.send("Something went wrong")
        else response.send(onePost)
    } catch (e){
        response.status(400).send(e.error.details[0].message)
    }
})

router.put('/edit/:id', verify, async (request, response)=>{
    //Validation
    const validation = editPostValidation(request.body)
    if (validation.error) response.send(validation.error.details[0].message)
    try{
        const onePost = await Post.findOne({_id: request.params.id, userId: request.user._id})
        if(!onePost.title) return response.send("Something went wrong")
        else {
            onePost.title = request.body.title;
            onePost.text = request.body.text;
            onePost.date = request.body.date;
            onePost.category = request.body.category;
            onePost.completed = request.body.completed;
            onePost.save()
            response.send("Updated")
        }
    } catch (e){
        return response.send("Something went wrong")
    }
})

router.delete('/delete/:id',verify, async (request, response) =>{
    try{
        const postForDelete = await Post.findOne({_id: request.params.id, userId: request.user._id})
        postForDelete.delete()
        response.send("Deleted")
    }catch(e){
        return response.send("Something went wrong")
    }
})

module.exports = router