const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

const dbHost = 'mongodb://database/mean-docker';

mongoose.connect(dbHost);

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  mobile: Number
});

const User = mongoose.model('User', userSchema);

router.get('/', (req, res) => {
    res.send('api is wired');
});

module.exports = router;