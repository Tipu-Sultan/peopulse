import React, { useEffect } from 'react';
import {
  Box, Flex,
  Text, Divider,
} from '@chakra-ui/react';
import { useChats } from '../context/ChatsContext'; // Assuming you have a custom hook for chat logic
import AudioVideoCall from '../ui-modals/AudioVideoCall';
import { useCall } from '../context/CallContext';
import ChatPanel from './ChatPanel';
import ChatHeader from './ChatHeader';
import ChatBox from './ChatBox';
import ChatInput from './ChatInput';
const ChatApp = () => {


  const {
    setIsMobile,
    chatboxRef,
    selectedFileName,
    selectedUser, isUser, messages,
    getFollowedUser,
  } = useChats();
  const { isOpen, onClose } = useCall();

  useEffect(() => {
    getFollowedUser();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 796);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatboxRef, messages]);



  return (
    <Box height="80vh" display="flex">

      {/* User List Panel */}
      <ChatPanel />

      {/* Header */}
      <Box width={{ base: '100%', md: '70%' }}  borderRadius="md" borderTopLeftRadius={0} borderBottomLeftRadius={0} overflow="hidden">

        <ChatHeader />

        {/* Chatbox with scrollable content */}
        <Flex direction="column" height="70vh">
          <ChatBox />

          <Divider />

          {/* Input field at bottom of chat card */}
          <ChatInput />
          {selectedFileName && (
            <Box p="3">
              <Text>{selectedFileName}</Text>
            </Box>
          )}
        </Flex>
      </Box>
      <AudioVideoCall
        isOpen={isOpen}
        onClose={onClose}
        selectedUser={selectedUser}
        isUser={isUser}
      />
    </Box>
  );
};

export default ChatApp;
