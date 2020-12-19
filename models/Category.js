const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min:1,
        max:255
    },
    userId:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Category', CategorySchema);