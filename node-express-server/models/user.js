const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email: {
        type: String,
        trim: true,
        minlenght: 1
    },
    name: {
        type: String,
        trim: true,
        minlength: 1
    },
    mobile: {
        type: Number,
        trim: true,
        minlength: 10
    }
});

module.exports = { 
    User 
};
