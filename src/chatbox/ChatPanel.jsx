import { Avatar, Badge, Box, CloseButton, Flex, List, ListItem, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react'
import { calculateTimeDifference } from '../services/timeConvert';
import { useChats } from '../context/ChatsContext';

const ChatPanel = () => {
    const { getLastMessage, isUserListOpen, setIsUserListOpen, userList, selectedUser, isUser, handleUserClick } = useChats();
    const bgColor = useColorModeValue('gray.100', 'gray.700');

    return (

        <Box
            width={{ base: '100%', md: '25%' }}
            display={{ base: isUserListOpen ? 'block' : 'none', md: 'block' }}
            border="1px"
            borderRadius="md"
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
            borderColor="gray.800"
            overflowY="auto"
            position={{ base: 'fixed', md: 'relative' }}
            top={{ base: '0', md: 'auto' }}
            left={{ base: '0', md: 'auto' }}
            height={{ base: '100%', md: 'auto' }}
            zIndex="999"
            bg={bgColor}
        >
            {isUserListOpen&&<CloseButton onClick={() => setIsUserListOpen(!isUserListOpen)} title="Close List" />}

            <List spacing={3} p={4}>
                {userList.map((user) => (
                    <ListItem
                        key={user.id}
                        p={2}
                        borderRadius={'md'}
                        cursor="pointer"
                        bg={selectedUser && selectedUser.username === user.username ? 'gray.400' : 'transparent'}
                        onClick={() => {
                            if (selectedUser?.username !== user.username) {
                                handleUserClick(user);
                                setIsUserListOpen(false); 
                            }
                        }}
                    >
                        <Flex align="center" position="relative">
                            <Avatar
                                size="md" src={user.profileImage} mr={2} />
                            <Box position="absolute" top="2" right="0">
                                {user?.isLogged ? (
                                    <Badge bg="green.600" borderRadius="full" boxSize="8px" />
                                ) : (
                                    <Badge bg="red.600" borderRadius="full" boxSize="8px" />
                                )}
                            </Box>
                            {getLastMessage(isUser.username, user.username) && getLastMessage(isUser.username, user.username)?.unreadCount > 0 &&
                                <Badge colorScheme="red" borderRadius="full" position="absolute" top="-4px" right="-4px" zIndex="1">
                                    {getLastMessage(isUser.username, user.username)?.unreadCount}
                                </Badge>
                            }
                            <VStack align="start" spacing={1}>
                                <Text color={selectedUser && selectedUser.username === user.username
                                    ? 'gray.900' : 'gray.300'}>
                                    {user.firstname + ' ' + user.lastname}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    {getLastMessage(isUser.username, user.username) && getLastMessage(isUser.username, user.username)?.message}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    {getLastMessage(isUser.username, user.username) && calculateTimeDifference(getLastMessage(isUser.username, user.username).timestamp)}
                                </Text>
                            </VStack>
                        </Flex>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default ChatPanel