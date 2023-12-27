const express = require('express');
const User = require('../models/user');
const Auth = require('../middleware/auth');

const router = new express.Router();

// sign-up
router.post('/users', async (req, res)=>{
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(404).send(error);
    }
});

// log in
router.post('/users/login', async(req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (error) {
        res.send(400).send(error);
    }
});

// log out
router.post('/users/logout', Auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })
        await req.user.save();
        res.send('Logged out');
    } catch(error) {
        res.send(500).send('Couldnot log out');
    }
});

// log out all
router.post('/users/logoutAll', Auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await user.save();  
        res.send('Logged out successfully');
    } catch(error) {
        res.send(500).send();
    }
});

module.exports = router;