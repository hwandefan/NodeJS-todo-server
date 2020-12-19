const { required, boolean } = require('@hapi/joi');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    text:{
        type: String,
        required: true,
        min: 1
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId:{
        type: String,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    category:{
        type: String,
        default: "Primary"
    }
});

module.exports = mongoose.model('Post', PostSchema);