const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

//hash and salt password and save into mongodb database
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('USER',userSchema);
