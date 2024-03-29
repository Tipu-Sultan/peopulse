import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Flex,
  Image,
  Avatar,
  Heading,
  Text,
  Stack,
  Button,
  HStack,
  Grid,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { DeleteUserModal } from '../ui-modals/DeleteModal';
import UserEditModal from '../ui-modals/UserEditModal';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { useFollow } from '../context/FollowContext';

const Profile = () => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isUser, handleOpenModal,getUserByUsername,loadedUser } = useAuth();
  const { posts, deleteAuthPost, RenderContent } = usePost();
  const { username } = useParams();
  useEffect(() => {
    getUserByUsername(username);
  }, [username]);

  const isCurrentUser = isUser.username === username;
  const bgColor = useColorModeValue('#151f21', 'gray.900')

  return (
    loadedUser &&
    <Container maxW={'full'} p={0}>
      <Box w={'full'} bg={bgColor} boxShadow={'lg'} rounded={'md'}>
        <Image
          h={'200px'}
          w={'full'}
          src={`${API_HOST}/${loadedUser.coverImage}`}
          objectFit="cover"
          alt="Cover Image"
        />
        <Flex justify={'center'} mt={-12}>
          <Avatar
            size={'xl'}
            src={`${API_HOST}/${loadedUser.profileImage}`}
            css={{
              border: '4px solid white',
            }}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={2} align={'center'} mb={5}>
            <Heading fontSize={'3xl'} fontWeight={600} fontFamily={'body'}>
              {loadedUser.username}
            </Heading>
            <Text color={'gray.500'}>{`${loadedUser.firstname} ${loadedUser.lastname}`}</Text>
            <Text>{loadedUser.email}</Text>
          </Stack>

          <Stack direction={'row'} justify={'center'} spacing={6}>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>{loadedUser.followers.length}</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Followers
              </Text>
            </Stack>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>{loadedUser.following.length}</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Following
              </Text>
            </Stack>
          </Stack>

          <Text mt={4} color={'gray.600'}>
            {loadedUser.bio || 'No bio available.'}
          </Text>

          {isCurrentUser && (
            <HStack>
              <Button
                w={'full'}
                mt={8}
                bg={bgColor}
                color={'white'}
                rounded={'md'}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                onClick={onOpen}
              >
                Edit
              </Button>
              <Button
                w={'full'}
                mt={8}
                bg={bgColor}
                color={'white'}
                rounded={'md'}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                onClick={handleOpenModal}
              >
                Delete Account
              </Button>
            </HStack>
          )}

          <Text py={5}>Posts by {loadedUser.username}</Text>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(5, 1fr)',
            }}
            gap={6}
            overflowX="auto"
          >
            {posts.map((post, i) => (
              loadedUser._id === post.user && (
                <SimpleGrid key={i} overflow={'hidden'} columns={1} spacing={4} borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
                  <Box>
                    {RenderContent(post.contentType.split("/")[0], post.media)}

                    <Heading size="md" mb={2}>
                      {post.content}
                    </Heading>

                    <Text color="gray.600" fontSize="sm" mb={4}>
                      {post.description}
                    </Text>

                    <HStack spacing={4} alignItems="center" mb={5}>
                      <Text>
                        <FaThumbsUp /> {post.likes.length}
                      </Text>
                      <Text>
                        <FaComment /> {post.comments.length}
                      </Text>
                    </HStack>
                    {isCurrentUser && (
                      <Button py={5} colorScheme="red" onClick={() => deleteAuthPost(post._id)}>
                        Delete
                      </Button>
                    )}
                  </Box>
                </SimpleGrid>
              )
            ))}
          </Grid>
        </Box>
      </Box>
      <DeleteUserModal />
      <UserEditModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default Profile;
