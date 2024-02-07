import React, { useState } from "react";
import {
  Grid,
  GridItem,
  Heading,
  Avatar,
  Box,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFollow } from "../context/FollowContext";
import { DeleteFollowModal } from "../ui-modals/DeleteModal";

const FollowButton = ({ text, onClick, bgColor }) => (
  <>
    <Button
      w={"full"}
      mt={8}
      bg={bgColor}
      color={'white'}
      rounded={"md"}
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "lg",
      }}
      onClick={onClick}
    >
      {text}
    </Button>

  </>
);

export default function Follow() {
  const [rid, setRid] = useState()
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const { users, handleFollow, isUser, handleOpenModal } = useFollow();

  const isFollowed = (sid, action) => {
    return users.some(user =>
      user.followers.some(follower =>
        follower.senderUsername === sid &&
        follower.receiverUsername === isUser.username &&
        follower.action === action
      )
    );
  };


  const isFollowing = (sid, action) => {
    return users.some(user =>
      user.followers.some(follower =>
        follower.senderUsername === isUser.username &&
        follower.receiverUsername === sid &&
        follower.action === action
      )
    );
  };




  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }}
      gap={4}
    >
      {users.map((user, i) => (
        user.username !== isUser.username &&
        <GridItem key={user._id}>
          <Box
            maxW={'auto'}
            w={'full'}
            bg={bgColor}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}
          >
            {/* User Profile Section */}
            <Image
              h={"120px"}
              w={"full"}
              src={
                "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              }
              objectFit="cover"
              alt="#"
            />
            <Flex justify={"center"} mt={-12}>
              <Avatar
                size={"xl"}
                src={
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                }
                css={{
                  border: "2px solid white",
                }}
              />
            </Flex>

            <Box p={6}>
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                  {user.firstname + ' ' + user.lastname}
                </Heading>
                <Text color={"gray.500"}>{user.username}</Text>
              </Stack>

              <Stack direction={"row"} justify={"center"} spacing={6}>
                <Stack spacing={0} align={"center"}>
                  <Text fontWeight={600}>{user.followers.length}</Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Followers
                  </Text>
                </Stack>
                <Stack spacing={0} align={"center"}>
                  <Text fontWeight={600}>{user.following.length}</Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Following
                  </Text>
                </Stack>
              </Stack>
              {(isFollowed(user.username, 'Requested') && user.username !== isUser.username) ? (
                <Stack key={i} direction={"row"} justify={"center"} spacing={6}>
                  <FollowButton
                    text={'Confirm'}
                    onClick={() => handleFollow(user.username, 'Following')}
                    bgColor={'gray.400'}
                  />
                  <FollowButton
                    text={'Delete'}
                    onClick={() => handleFollow(user.username, 'Delete')}
                    bgColor={'red.400'}
                  />
                </Stack>
              ) : isFollowing(user.username, 'Requested') && user.username !== isUser.username ? (
                <FollowButton
                  key={i}
                  text={isFollowing(user.username) && user.username !== isUser.username ? 'Requested' : 'Requested'}
                  onClick={() => handleFollow(user.username, 'Cancel')}
                  bgColor={'gray.400'}
                />
              ) : isFollowed(user.username, 'Following') || isFollowing(user.username, 'Following')
                ?
                (
                  <FollowButton
                    key={i}
                    text={'Following'}
                    bgColor={'rgba(0, 0, 0, 0)'}
                    onClick={() => { setRid(user.username); handleOpenModal(); }}
                  />
                )
                : (
                  <FollowButton
                    key={i}
                    text={'Follow'}
                    onClick={() => handleFollow(user.username, 'Requested')}
                    bgColor={'blue.400'}
                  />
                )}

            </Box>
          </Box>
          <DeleteFollowModal rid={rid} />
        </GridItem>
      ))}
    </Grid>
  );
}
