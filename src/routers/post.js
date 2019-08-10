const express = require('express')
const Post = require('../models/post')
const auth = require('../middleware/auth')
require ('../db/mongoose')
const router = new express.Router()

//! Create Blog Post
router.post('/posts', auth, async (req, res) => {
    const post = new Post({
        ...req.body,
        blogger: req.user.name,
        owner: req.user._id
    })

    try {
        await post.save()
        res.status(201).send(post)
    } catch (e) {
        res.status(400).send(e)
    }
})

//! Get all posts from newest
router.get('/posts', async (req, res) => {
    //try {
        const posts = await Post.find({}, {'_id': 0, 'title':1, 'post':1, 'blogger':1, 'category':1}).sort({createdAt: -1})
        res.send(posts)
    //} catch (e) {
        res.status(500).send()
    //}
})

//! Get posts from user
router.get('/posts/:id', async (req, res) => {
    const _id = req.params.id
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        const posts = await Post.find({owner: _id})
        .sort(sort)
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))

        if(!posts) {
            return res.status(404).send('No posts from this user')
        }

        res.send(posts)
    } catch (e) {
        res.status(500).send()
    }
})

//! Get all posts from category
router.get('/category/:category', async (req, res) => {
    const category = req.params.category

    try{
        const posts = await Post.find({ category }).sort({createdAt: -1})
        res.send(posts)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router

















