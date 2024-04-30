import React, { useState } from 'react';
import { Box, IconButton, Icon } from "@chakra-ui/react";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { usePost } from '../context/PostContext';

const Reels = () => {
    const { posts } = usePost();
    const API_HOST = process.env.REACT_APP_API_HOST;
    const videoPosts = posts.filter(post => post.contentType.split("/")[0] === "video");
    const [currentReelIndex, setCurrentReelIndex] = useState(0);

    const playNextReel = () => {
        setCurrentReelIndex((prevIndex) => (prevIndex + 1) % videoPosts.length);
    };

    const playPreviousReel = () => {
        setCurrentReelIndex((prevIndex) => (prevIndex - 1 + videoPosts.length) % videoPosts.length);
    };

    const currentPost = videoPosts[currentReelIndex];
    const media = currentPost ? currentPost.media : '';
    const title = currentPost ? currentPost.title : '';

    return (
        <Box
            maxW="400px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            mx="auto"
            my="4"
            position="relative"
            backgroundColor="white"
            transition="top 0.5s ease-in-out" 
            top={`-${currentReelIndex * 100}%`} 
        >
            {/* Video */}
            {currentPost && (
                <Box position="relative" overflow="hidden" h={'600px'} borderRadius="md" maxW="400px">
                    <video controls width="100%" style={{ objectFit: 'cover' }}>
                        <source src={`${API_HOST}${media}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Box>
            )}

            {/* Up and Down Arrow Buttons */}
            <Box position="absolute" right="0" top="0" transform="translate(100%, 0)" textAlign="center">
                <IconButton aria-label="Up Arrow" icon={<Icon as={MdArrowUpward} />} size="sm" m="1" onClick={playPreviousReel} />
            </Box>
            <Box position="absolute" right="0" bottom="0" transform="translate(100%, 0)" textAlign="center">
                <IconButton aria-label="Down Arrow" icon={<Icon as={MdArrowDownward} />} size="sm" m="1" onClick={playNextReel} />
            </Box>
            <Box position="absolute" bottom="0" left="0" right="0" bg="rgba(0, 0, 0, 0.7)" color="white" p="2">
                <span>{title}</span>
            </Box>
        </Box>
    );
};

export default Reels;
