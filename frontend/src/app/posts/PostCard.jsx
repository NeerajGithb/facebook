import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, MoreHorizontal, SeparatorHorizontal, Share2, ThumbsUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import PostComments from "./PostComments";
import { formateDate } from "@/lib/utils";
import { usePostStore } from "@/store/usePostStore";
import userStore from "@/store/userStore";
import Confirm from "../components/Confirm";
const PostCard = ({ post, isLiked, onShare, onComment, onLike }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef(null)
  const {user}=userStore();
  const { handleDeletePost } = usePostStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const handleCommentClick = () =>{
    setShowComments(true);
    setTimeout(() =>{
      commentInputRef?.current?.focus();
    },0)
  }

  const confirmDelete = async () => {
    setShowConfirm(false);
    try {
      await handleDeletePost(post?._id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const cancelDelete = () => setShowConfirm(false);


  const userPostPlaceholder = post?.user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const generateSharedLink = () => {
    return `http://localhost:3000/${post?.id}`;
  };
  const handleShare = (platform) => {
    const url = generateSharedLink();
    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsShareDialogOpen(false);
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
    setIsShareDialogOpen(false);
  };
  return (
    <motion.div
      key={post?._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="sm:p-6 p-[2px]  dark:text-white">
          <div className="flex items-center justify-between mb-4">
            <div
              className="flex items-center space-x-3 cursor-pointer"

            >
              <Avatar>
                {post?.user?.profilePicture ? (
                                 <AvatarImage
                                 src={post?.user?.profilePicture}
                                 alt={post?.user?.username}
                                 />
                ):(
                  <AvatarFallback className="dark:bg-gray-400">{userPostPlaceholder}</AvatarFallback>
                )}
    
              
  
              </Avatar>
              <div>
                <p className="font-semibold dark:text-white">
                  {post?.user?.username}
                </p>
                <p className="font-sm text-gray-500">
                  {formateDate(post?.createdAt)}
                </p>
              </div>
            </div>
            {/* Dropdown Menu for "More" options */}
           {user?._id=== post?.user?._id && (
             <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="dark:hover:bg-gray-500">
                 <MoreHorizontal className="dark:text-white h-4 w-4" />
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent className="dark:bg-gray-900 bg-gray-100 rounded-md">
               <DropdownMenuItem>
                 <Button variant="ghost">Edit</Button>
               </DropdownMenuItem>
               <Separator className="mb-2 dark:bg-gray-400 bg-gray-950"/>
               <DropdownMenuItem>
               <Button variant="ghost" onClick={() => setShowConfirm(true)}>Delete</Button>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
           )}
          </div>
          <p className="mb-4">{post?.content}</p>
          {post?.mediaUrl && post.mediaType === "image" && (
            <img
              src={post?.mediaUrl}
              alt="post_image"
              className="w-full sm:w-auto h-full m-auto  sm:h-[500px] sm:rounded-lg mb-4"
            />
          )}
          {post?.mediaUrl && post.mediaType === "video" && (
            <video controls className="w-full sm:w-auto h-full sm:h-[500px] sm:rounded-lg mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag
            </video>
          )}
          <div className="flex justify-between items-center mb-4 max-sm:px-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer ">
              {post?.likeCount} likes
            </span>
            <div className="flex gap-3">
              <span
                className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer "
              onClick={() => setShowComments(!showComments)}
              >
                    {post?.commentCount} comments
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-2 border-gray-400 cursor-pointer ">
              {post?.shareCount} share
              </span>
            </div>
          </div>
          <Separator className="mb-2 dark:bg-gray-400" />
          <div className="flex justify-between mb-2">
            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-600 ${isLiked ? "text-blue-600" :""}`}
              onClick={onLike}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Like
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 dark:hover:bg-gray-600 `}
              onClick={handleCommentClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Comment
            </Button>
            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 dark:hover:bg-gray-500"
                onClick={onShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share This Post</DialogTitle>
                  <DialogDescription>
                    Choose how you want to share this post
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 ">
                  <Button onClick={() => handleShare("facebook")}>
                    Share on Facebook
                  </Button>
                  <Button onClick={() => handleShare("twitter")}>
                    Share on Twitter
                  </Button>
                  <Button onClick={() => handleShare("linkedin")}>
                    Share on Linkedin
                  </Button>
                  <Button onClick={() => handleShare("copy")}>Copy Link</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="mb-2 dark:bg-gray-400" />
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostComments
                  post={post}
                  onComment={onComment}
                  commentInputRef={commentInputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {showConfirm && (
            <Confirm
              title="Are you sure?"
              message="This action will permanently delete this post."
              onDelete={confirmDelete}
              onClose={cancelDelete}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
