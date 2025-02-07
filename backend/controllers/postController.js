const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../config/cloudinary");
const Post = require("../model/Post");
const Story = require("../model/story");
const response = require("../utils/responceHandler");




const createPost = async(req,res) =>{
    try {
        const userId = req.user.userId;
        console.log(userId)
        const {content} = req.body;
        const file= req.file;
        let mediaUrl = null;
        let mediaType = null;

        if(file) {
          const uploadResult = await uploadFileToCloudinary(file)
          mediaUrl= uploadResult?.secure_url;
          mediaType= file.mimetype.startsWith('video') ? 'video' : 'image';
        }
       
        //create a new post
        const newPost = new Post({
            user: userId,
            content,
            mediaUrl,
            mediaType,
            likeCount: 0,
            commentCount: 0,
            shareCount: 0,
        })

        await newPost.save();
        return response(res,201,'Post created successfully', newPost)

    } catch (error) {
         console.log('error creating post',error)
         return response(res,500, 'Internal server error',error.message)
    }
}

//delete post 
const deletePost = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the user ID from the request (assumed that the user is logged in)
        const postId = req.params.id;  // Get the post ID from the URL parameters
        
        // Find the post by its ID
        const post = await Post.findById(postId);

        if (!post) {
            return response(res, 404, 'Post not found');
        }

        // Check if the logged-in user is the owner of the post
        if (post.user.toString() !== userId.toString()) {
            return response(res, 403, 'You are not authorized to delete this post');
        }

        // Optionally, delete the media from Cloudinary (if you want to clean up the uploaded file)
        if (post.mediaUrl) {
            const publicId = post.mediaUrl.split('/').pop().split('.')[0]; // Extract the public ID from the URL
            await deleteFileFromCloudinary(publicId);  // Function to delete the file from Cloudinary
        }

        // Delete the post from the database
        await Post.findByIdAndDelete(postId);
        
        return response(res, 200, 'Post deleted successfully');
    } catch (error) {
        console.log('error deleting post', error);
        return response(res, 500, 'Internal server error', error.message);
    }
};

//create story 

const createStory = async(req,res) =>{
    try {
        const userId = req.user.userId;
        const file= req.file;
        
        if(!file) {
            return response(res,400, 'file is required to create a story')
        }
        let mediaUrl = null;
        let mediaType = null;

        if(file) {
          const uploadResult = await uploadFileToCloudinary(file)
          mediaUrl= uploadResult?.secure_url;
          mediaType= file.mimetype.startsWith('video') ? 'video' : 'image';
        }
       
        //create a new story
        const newStory = new Story({
            user: userId,
            mediaUrl,
            mediaType
        })

        await newStory.save();
        return response(res,201,'Story created successfully', newStory)

    } catch (error) {
         console.log('error creating story',error)
         return response(res,500, 'Internal server error',error.message)
    }
}

//delete story by id
const deleteStory = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the user ID from the request (assumed that the user is logged in)
        const storyId = req.params.id;  // Get the story ID from the URL parameters
        
        // Find the story by its ID
        const story = await Story.findById(storyId);

        if (!story) {
            return response(res, 404, 'Story not found');
        }

        // Check if the logged-in user is the owner of the story
        if (story.user.toString() !== userId.toString()) {
            return response(res, 403, 'You are not authorized to delete this story');
        }

        // Optionally, delete the media from Cloudinary (if you want to clean up the uploaded file)
        if (story.mediaUrl) {
            const publicId = story.mediaUrl.split('/').pop().split('.')[0]; // Extract the public ID from the URL
            await deleteFileFromCloudinary(publicId);  // Function to delete the file from Cloudinary
        }

        // Delete the story from the database
        await Story.findByIdAndDelete(storyId);
        
        return response(res, 200, 'Story deleted successfully');
    } catch (error) {
        console.log('error deleting story', error);
        return response(res, 500, 'Internal server error', error.message);
    }
};

//getAllStory
const getAllStory = async(req, res) => {
    try {
        const story = await Story.find()
        .sort({createdAt: -1})
        .populate('user','_id username profilePicture email')

        return response(res, 201, 'Get all story successfully', story)
    } catch (error) {
        console.log('error getting story',error)
        return response(res,500,'Internal server error',error.message)
    }
}



//get all posts
const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find()
        .sort({createdAt: -1})
        .populate('user','_id username profilePicture email')
        .populate({
            path: 'comments.user',
            select: 'username profilePicture'
        })
        return response(res, 201, 'Get all posts successfully', posts)
    } catch (error) {
        console.log('error getting posts',error)
        return response(res,500,'Internal server error',error.message)
    }
}


//get post by userId
const getPostByUserId = async(req, res) => {
    const {userId} = req.params;
    
    try {
        if(!userId){
            return response(res,400,'UserId is require to get user post')
        }

        const posts = await Post.find({user:userId})
        .sort({createdAt: -1})
        .populate('user','_id username profilePicture email')
        .populate({
            path: 'comments.user',
            select: 'username, profilePicture'
        })
        return response(res, 201, 'Get user post successfully', posts)
    } catch (error) {
        console.log('error getting posts',error)
        return response(res,500,'Internal server error',error.message)
    }
}

//like post api
const likePost = async(req, res) => {
    const {postId} = req.params;
    const userId= req.user.userId;
    console.log(userId)
    try {
         const post = await Post.findById(postId)
         if(!post) {
            return response(res,404,'post not found')
         }
         const hasLiked = post.likes.includes(userId)
         if(hasLiked){
            post.likes = post.likes.filter(id => id.toString() !== userId.toString())
            post.likeCount =  Math.max(0, post.likeCount - 1) ; //ensure llikecount does not go negative
         }else{
            post.likes.push(userId)
            post.likeCount += 1
         }


         //save the like in updated post
         const updatedpost = await post.save()
         return response(res, 201, hasLiked ? "Post unlike successfully": "post liked successfully", updatedpost )
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }
}

//post comments by user

const addCommentToPost = async(req,res) =>{
    const {postId} = req.params;
    const userId= req.user.userId;
    const {text} = req.body;
    try {
         const post = await Post.findById(postId)
         if(!post) {
            return response(res,404,'post not found')
         }


         post.comments.push({user:userId,text})
         post.commentCount+=1;
          
         //save the post with new comments
         await post.save()
         return response(res, 201, "comments added successfully", post )
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }
}



//share on post by user
const sharePost = async(req, res) => {
    const {postId} = req.params;
    const userId= req.user.userId;
    try {
         const post = await Post.findById(postId)
         if(!post) {
            return response(res,404,'post not found')
         }
         const hasUserShared = post.share.includes(userId)
         if(!hasUserShared){
             post.share.push(userId)
         }

         post.shareCount +=1;

         //save the share in updated post
          await post.save()
         return response(res, 201, 'post share successfully', post )
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }
}







module.exports= {
    createPost,
    deletePost,
    getAllPosts,
    getPostByUserId,
    likePost,
    addCommentToPost,
    sharePost,
    createStory,
    deleteStory,
    getAllStory
}