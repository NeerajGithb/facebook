import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a button component
import { X } from "lucide-react"; // For the close icon

const Confirm = ({ onClose, onDelete, username }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Delete Story
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Are you sure you want to delete this story? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            {/* Cancel Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            {/* Delete Button */}
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
