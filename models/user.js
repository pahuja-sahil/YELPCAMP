const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLMongoose = require('passport-local-mongoose');

const userSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLMongoose); // this will add username and password to the schema
module.exports = mongoose.model('User', userSchema);