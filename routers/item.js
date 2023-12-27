const express = require('express');
const Item = require('../models/item');
const Auth = require('../middleware/auth');

const router = new express.Router();

// fetch all items
router.get('/items', async (req, res)=>{
    try {
        const items = await Item.find({});
        res.status(200).send(items);
    } catch(error) {
        res.status(400).send(error);
    }
});

// fetch an item
router.get('/items/:id', async (req, res)=>{
    try {
        const item = await Item.findOne({_id: req.params.id});
        if(!item) {
            res.status(404).send({error: "Item not found"});
        } else {
            res.status(200).send(item);
        }
    } catch(error) {
        res.status(400).send(error);
    } 
});


// Create an item
router.post('/items', Auth, async (req, res)=> {
    try{
        const newItem = new Item({...req.body, owner: req.user._id})
        await newItem.save();
        res.status(201).send(newItem);
    } catch(error) {
        res.status(400).send({message: "error"})
    }
})

// Update an item
router.patch('/items/:id', Auth, async(req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'category', 'price'];
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOperation) {
        return res.status(400).send({error: 'invalid updates'});
    }
    try {
        const item = await Item.findOne({_id: req.params.id});
        if(!item) {
            return res.status(404).send();
        }
        updates.forEach((update)=>item[update] = req.body[update]);
        await item.save();
        res.send(item);
        res.status(200).send('Updated');
    }catch(error) {
        res.status(400).send(error);
    }
});

// Delete Item
router.delete('/items/:id', Auth, async(req, res)=>{
    try {
        const deletedItem = await Item.findOneAndDelete({_id: req.params.id});
        if(!deletedItem) {
            res.send(404).send({error: "Item not found"});
        } else {
            res.send(deletedItem);
        }
    } catch(error) {
        res.send(400).send(error);
    }
});

module.exports = router;