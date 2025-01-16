const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../config/cloudinary');
const { createPost, getAllPosts, getPostByUserId, likePost, sharePost, addCommentToPost, getAllStory, createStory, deleteStory, deletePost } = require('../controllers/postController');
const router = express.Router();


//create post
router.post('/posts',authMiddleware,multerMiddleware.single('media'),createPost)
//delete post
router.delete('/delete/:id',authMiddleware,multerMiddleware.single('media'),deletePost)

//get all posts
router.get('/posts',authMiddleware,getAllPosts)

//get post by userid
router.get('/posts/user/:userId',authMiddleware,getPostByUserId)


//user like post route
router.post('/posts/likes/:postId',authMiddleware,likePost)


//user share post route
router.post('/posts/share/:postId',authMiddleware,sharePost)


//user comments post route
router.post('/posts/comments/:postId',authMiddleware,addCommentToPost)



//create story
router.post('/story',authMiddleware,multerMiddleware.single('media'),createStory)
//delete story
router.delete('/story/:id',authMiddleware,multerMiddleware.single('media'),deleteStory)

//get all story
router.get('/story',authMiddleware,getAllStory)


module.exports = router;