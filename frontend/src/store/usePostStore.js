import {
  createPost,
  deletePost,
  getAllPosts,
  getAllStory,
  getAllUserPosts,
  likePost,
  sharePost,
  createStory,
  deleteStory,
  commentsPost
} from "@/service/post.service";
import toast from "react-hot-toast";
import { create } from "zustand";

export const usePostStore = create((set) => ({
  posts: [],
  userPosts: [],
  story: [],
  loading: false,
  error: null,

  //fetchPost
  fetchPost: async () => {
    set({ loading: true });
    try {
      const posts = await getAllPosts();
      set({ posts, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  //fetch user posts
  fetchUserPost: async (userId) => {
    set({ loading: true });
    try {
      const userPosts = await getAllUserPosts(userId);
      set({ userPosts, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  //fetch all story
  fetchStoryPost: async () => {
    set({ loading: true });
    try {
      const story = await getAllStory();
      set({ story, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  //create a new post
  handleCreatePost: async (postData) => {
    set({ loading: true });
    try {
      const newPost = await createPost(postData);
      set((state) => ({
        posts: [newPost, ...state.posts],
        loading: false,
      }));
      toast.success("Post created successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error("failed to create a post");
    }
  },
  //delete a post
  handleDeletePost: async (postId) => {
    set({ loading: true });
    try {
      await deletePost(postId);
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
        loading: false,
      }));
      toast.success("Post deleted successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error("failed to delete a post");
    }
  },
  //create a new story
  handleCreateStory: async (storyData) => {
    set({ loading: true });
    try {
      const newStory = await createStory(storyData);
      set((state) => ({
        story: [newStory, ...state.story],
        loading: false,
      }));
      toast.success("Story created successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error("failed to create a story");
    }
  },
  HandledeleteStory: async (storyId) => {
    set({ loading: true });
    try {
      await deleteStory(storyId);
      set((state) => ({
        story: state.story.filter((story) => story._id !== storyId),
        loading: false,
      }));
      toast.success("Story deleted successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error("failed to delete a story");
    }
  },
  //create a new story
  handleLikePost: async (postId) => {
    set({ loading: true });
    try {
       await likePost(postId);
    } catch (error) {
      set({ error, loading: false });
    }
  },

  //create a new story
  handleCommentPost: async (postId,text) => {
    set({ loading: true });
    try {
      const newComments = await commentsPost(postId, {text});
       set((state) =>({
         posts: state.posts.map((post) => 
            post?._id === postId
             ? {...post,comments: [...post.comments, newComments]}
             :post
        ),
       }))
      toast.success("Comments added successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error("failed to add comments");
    }
  },


  //create a new story
  handleSharePost: async (postId) => {
    set({ loading: true });
    try {
       await sharePost(postId);
       toast.success("post share successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error('failed to share this post')
    }
  },
}));
