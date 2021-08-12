const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogTitle:{
        type:String,
        required:true
    },
    blogBody:{
        type:String,
        required:true
    },
    user_id:String,
    date: {
        type: Date,
        default: new Date()
    },
    imageName:String
})

module.exports = mongoose.model('BLOG',blogSchema);