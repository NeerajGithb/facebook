import React, { useEffect, useRef, useState } from "react";
import StoryCard from "./StoryCard";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePostStore } from "@/store/usePostStore";
import { Button } from "@/components/ui/button";

const StorySection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef(null);
  const { story, fetchStoryPost } = usePostStore();

  useEffect(() => {
    fetchStoryPost();
  }, [fetchStoryPost]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateMaxScroll = () => {
        setMaxScroll(container.scrollWidth - container.offsetWidth);
        setScrollPosition(container.scrollLeft);
      };
      updateMaxScroll();
      window.addEventListener("resize", updateMaxScroll);
      return () => window.removeEventListener("resize", updateMaxScroll);
    }
  }, [story]);

  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
    }
  };

  return (
    <div className="relative flex justify-center items-center py-4">
      {/* Story Container (Fixed Width) */}
      <div className="w-full max-w-[600px] overflow-hidden relative">
        {/* Scroll Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex space-x-2 overflow-x-auto scrollbar-hide w-full"
        >
          <motion.div
            className="flex space-x-2 w-max"
            drag="x"
            dragConstraints={{
              right: 0,
              left: -((story.length + 1) * 200) + (containerRef.current?.offsetWidth || 0),
            }}
          >
            <StoryCard isAddStory={true} />
            {story?.map((story) => (
              <StoryCard story={story} key={story._id} />
            ))}
          </motion.div>
        </div>

        {/* Left Scroll Button */}
        {scrollPosition > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Right Scroll Button */}
        {scrollPosition < maxScroll && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StorySection;
