require('../config/env')

const express = require('express');
const {ObjectID} = require('mongodb');

const { mongoose } = require('../repository/mongoose');
const {User} = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('api is wired');
});

router.get('/user/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    
    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).send();
            }
        
            res.status(200).json(user);
        }).catch(error => {
            res.status(500).json({
                message: 'Error fetching user data'
            });
        });
});

router.post('/user', (req, res) => {
    const user = new User({
        email: req.body.email
    })

    user.save()
        .then((result) => {
            res.status(201).json({
                message: 'Email saved successfully',
                data : {
                    id: result._id
                }
            });
        }).catch(error => {
            respond.status(500).json({
                message: 'Unable to save email address'
            });
        });
});

router.put('/user/:id', (req, res) => {
    const id = req.params.id;
    let data = null;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (req.body.name || req.body.mobile) {
        data = req.body;
    } else {
        return res.status(400).send();
    }

    updateUserData(res, id, data);
});

function updateUserData(res, id, data) {
    User.findByIdAndUpdate(id, {$set: data})
        .then(user => {
            res.status(200).json({
                message: 'Name saved successfully'
            });
        }).catch(error => {
            res.status(500).json({
                message: 'Unable to update user'
            });
        });
}

module.exports = router;