import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { X, Trash } from "lucide-react";
import React, { useState } from "react";
import Confirm from "../components/confirm";
const ShowStoryPreview = ({
  file,
  fileType,
  onClose,
  onPost,
  onDelete, // New prop for delete functionality
  isNewStory,
  isOwner, // Boolean to check if the logged-in user owns the story
  username,
  avatar,
  isLoading,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Track deletion state
  const userPlaceholder = username
    ?.split(" ")
    .map((name) => name[0].toUpperCase())
    .join("");

  const handleDelete = () => {
    setShowConfirm(true);
  };
  const confirmDelete = async () => {
    setShowConfirm(false); // Close the confirm modal after deletion
    setIsDeleting(true); // Set to deleting state
    await onDelete(); // Call the delete function passed as a prop
    setIsDeleting(false); // Reset deleting state
  };
  // Function to cancel deletion
  const cancelDelete = () => {
    setShowConfirm(false); // Close the confirm modal without deleting
  };
  return (
    <div className="fixed inset-0  bg-black bg-opacity-70 flex items-center sm:justify-center z-50 my-class">
      <div className="relative w-full mx-auto max-w-md h-[70vh] flex flex-col bg-white dark:bg-gray-800 sm:rounded-lg overflow-hidden">
        <Button
          className="absolute top-4 right-4 z-10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          variant="ghost"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="absolute top-4 left-4 z-10 flex items-center">
          <Avatar className="w-10 h-10 mr-2 ring-2 ring-blue-500 flex items-center justify-center bg-gray-800">
            {avatar ? (
              <AvatarImage src={avatar} alt={username} />
            ) : (
              <AvatarFallback className="text-gray-300">
                {userPlaceholder}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-gray-300 font-semibold">{username}</span>
        </div>
        <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          {fileType === "image" ? (
            <img
              src={file}
              alt="story_preview"
              className="max-w-full  min-h-full  object-contain"
            />
          ) : (
            <video
              src={file}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {isOwner && !isNewStory && ( // Show delete button only for the owner and non-new stories
            <Button
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
            >
            {isDeleting ? (
                <>Deleting...</> // Show "Deleting..." while the deletion is in progress
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          )}
          {isNewStory && (
            <Button
              onClick={onPost}
              className="bg-blue-500 hover:bg-orange-500 text-white"
            >
              {isLoading ? "Uploading..." : "Share"}
            </Button>
          )}
        </div>
      </div>
      {showConfirm && (
        <Confirm
          onClose={cancelDelete} // Close modal without deleting
          onDelete={confirmDelete} // Confirm deletion
          username={username}
        />
      )}
    </div>
  );
};

export default ShowStoryPreview;
