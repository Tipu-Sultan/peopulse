import { Avatar, Box, Flex, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useChats } from '../context/ChatsContext';
import { FaEllipsisH, FaPhone, FaVideo } from 'react-icons/fa';
import { useCall } from '../context/CallContext';
import { HamburgerIcon } from '@chakra-ui/icons';

const ChatHeader = () => {
    const {isOnline, isTyping, typingUser, selectedUser, setIsUserListOpen, isUserListOpen, isMobile } = useChats();
    const { handleCallClick } = useCall();
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    return (
        <Flex
            align="center"
            justify="space-between"
            bg={bgColor}
            p="2"
            borderBottom="1px"
            borderColor="gray.700"
        >
            <Flex align="center">
                {isMobile && (
                    <IconButton
                        icon={<HamburgerIcon />}
                        aria-label="Open Menu"
                        onClick={() => setIsUserListOpen(!isUserListOpen)}
                        mr="2"
                    />
                )}
                <Avatar size="md" src={selectedUser && selectedUser?.profileImage} mr="2" />

                <Box mr="2">
                    <Text fontWeight="bold">
                        {selectedUser && selectedUser?.firstname + ' ' + selectedUser?.lastname}
                    </Text>
                    {selectedUser && (isTyping && typingUser) ? (
                        <Text fontWeight="bold" color="green.500">
                            Typing...
                        </Text>
                    ) : (
                        selectedUser && <Text fontWeight="bold" fontSize={'small'} color={isOnline?.includes(selectedUser?.username)? 'green.500' : 'green.400'}>
                            {isOnline?.includes(selectedUser?.username) ? 'online' :'last seen at '+ selectedUser?.lastSeen}
                        </Text>
                    )}
                </Box>
                {selectedUser && (
                    <>
                        <IconButton
                            icon={<FaPhone />}
                            aria-label="Audio Call"
                            onClick={() => handleCallClick('audio')}
                            mr="2"
                        />
                        <IconButton
                            icon={<FaVideo />}
                            aria-label="Video Call"
                            onClick={() => handleCallClick('video')}
                            mr="2"
                        />
                    </>
                )}
            </Flex>
            <Menu>
                <MenuButton as={IconButton} icon={<Icon as={FaEllipsisH} title="Show more" />} />
                <MenuList>
                    <MenuItem>Block</MenuItem>
                    <MenuItem>Clear chats</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default ChatHeader;
