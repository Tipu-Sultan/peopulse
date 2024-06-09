import {
    Avatar, Badge, Box, CloseButton, Flex, Input, IconButton, List, ListItem, Text, VStack, useColorModeValue,
    useDisclosure
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { calculateTimeDifference } from '../services/timeConvert';
import { useChats } from '../context/ChatsContext';
import CreateGroupModal from '../ui-modals/CreateGroupModal';
import { Link } from 'react-router-dom';

const ChatPanel = () => {
    const {
        isOnline, getLastMessage, isUserListOpen, setIsUserListOpen, userList, selectedUser, isUser, handleUserClick
    } = useChats();

    const [searchTerm, setSearchTerm] = useState('');
    const bgColor = useColorModeValue('gray.100', 'gray.700');

    const filteredUserList = userList
        // Sort the user list based on the latest chat or activity
        .sort((userA, userB) => {
            const lastMessageA = getLastMessage(isUser.username, userA.username);
            const lastMessageB = getLastMessage(isUser.username, userB.username);
            if (!lastMessageA && !lastMessageB) return 0;
            if (!lastMessageA) return 1;
            if (!lastMessageB) return -1;
            return lastMessageB.timestamp - lastMessageA.timestamp;
        })
        // Filter the sorted user list based on the search term
        .filter(user =>
            `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
        );


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
            {isUserListOpen && (
                <CloseButton
                    onClick={() => setIsUserListOpen(!isUserListOpen)}
                    title="Close List"
                />
            )}

            <Box p={4} borderBottom="1px" borderColor="gray.200">
                <Flex align="center" justify="space-between">
                    <Input
                        placeholder="Search friends..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="sm"
                        borderRadius={'md'}
                    />
                </Flex>
            </Box>

            <List spacing={3} p={4}>
                {filteredUserList.map((user) => (
                    <Link to={`/chat/${user?.username}`}>
                    <ListItem
                        key={user.id}
                        p={2}
                        borderRadius="md"
                        cursor="pointer"
                        bg={selectedUser && selectedUser.username === user.username ? 'gray.400' : 'transparent'}
                        onClick={() => {
                            if (selectedUser?.username !== user.username) {
                                handleUserClick(user,user?.username);
                                setIsUserListOpen(false);
                            }
                        }}
                    >
                        <Flex align="center" position="relative">
                            <Avatar
                                size="md" src={user.profileImage} mr={2}
                            />
                            <Box position="absolute" top="2" right="0">
                                {isOnline?.includes(user?.username) ? (
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
                    </Link>
                ))}
            </List>
        </Box>
    );
};

export default ChatPanel;
