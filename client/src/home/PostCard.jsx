import React, { useState } from "react";
import {
  Box,
  HStack,
  Text,
  IconButton,
  CloseButton,
  VStack,
  Avatar,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import { FaHeart, FaComment, FaEllipsisH,FaRegPaperPlane } from "react-icons/fa";
import CommentModal from "../ui-modals/CommentModal";
import { calculateTimeDifference } from "../services/timeConvert";
import { usePost } from "../context/PostContext";


const PostCard = () => {
  const { posts, handleLike, deleteAuthPost, user, RenderContent,handleSharePost } = usePost();
  const [commentModalOpen, setCommentModalOpen] = useState(null);

  const handleCommentModal = (postId) => {
    setCommentModalOpen(postId);
  };

  return (
    <>
      {posts.slice().reverse().map((post, i) => (
        <>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p="4"
            mb="4"
            maxW="600px"
            mx="auto"
            width="100%"
            position="relative"
            key={i}
          >
            <Flex justify="space-between" align="center">
              <HStack spacing="4" align="center" mb="2">
                <Avatar size="md" name={post.username[1]} src={post.username[1]} />
                <VStack align="start">
                  <Text fontWeight="bold">{post.username}</Text>
                  <Text color="gray.500">
                    {calculateTimeDifference(post.createdAt)}
                  </Text>
                </VStack>
              </HStack>

              <HStack spacing="2">
                <Menu>
                  <MenuButton as={IconButton} icon={<Icon as={FaEllipsisH} title="show more" />} />
                  <MenuList>
                    {user._id === post.user && <MenuItem onClick={() => deleteAuthPost(post._id)}>Delete post</MenuItem>}
                    <MenuItem>report</MenuItem>
                    <MenuItem>edit</MenuItem>
                  </MenuList>
                </Menu>
                <CloseButton title="Not intrested" />
              </HStack>
            </Flex>

            {RenderContent(
              post.contentType.split("/")[0],
              post.media,
              post.content
            )}

            <HStack justify="space-between" align="center">
              <HStack spacing="1">
                <IconButton
                  icon={
                    <FaHeart
                      color={
                        post.likes.some((like) => like.user === user.username) ? "red" : "gray"
                      }
                    />
                  }
                  aria-label="Like Post"
                  onClick={() => handleLike(post._id)}
                  mt={1}
                />
                <Text>{post.likes.length}</Text>

                <IconButton
                  mt={1}
                  variant="ghost"
                  icon={<FaRegPaperPlane />}
                  onClick={()=>handleSharePost(post._id,post.media,post.contentType)}
                />
              </HStack>
              <HStack
                spacing="1"
                onClick={() => handleCommentModal(post._id)}
                cursor="pointer"
              >
                <IconButton icon={<FaComment />} aria-label="Comment" mt={1} />
                <Text>{post.comments.length}</Text>
              </HStack>
            </HStack>
          </Box>
          <CommentModal
            isOpen={commentModalOpen === post._id}
            postId={post._id}
            onClose={() => setCommentModalOpen(null)}
            postComments={post.comments}
            username={post.username}
          />
        </>
      ))}
    </>
  );
};

export default PostCard;
