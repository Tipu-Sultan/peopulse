import {
  Box,
  Flex,
  Input,
  IconButton,
  Text,
  Divider,
  Avatar,
  List,
  ListItem,
  Button,
  Image,
  VStack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { FaEllipsisH, FaFileDownload, FaPaperclip, FaTrash } from 'react-icons/fa';
import { useChats } from '../context/ChatsContext';
import { useEffect, useRef } from 'react';
import { calculateTimeDifference } from '../services/timeConvert';
import { CloseIcon } from '@chakra-ui/icons';

const ChatApp = () => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const chatboxRef = useRef(null);
  const {
    isTyping, checkTyping, typingUser,
    dowloadMessageFile, fileInputRef,
    selectedFileName, editableMessageId,
    setEditableMessageId, setSelectedFile,
    setSelectedFileName, userList,
    selectedUser, isUser,
    handleUserClick, messages, allmessages,
    getFollowedUser, handleSendMessage,
    handleDeleteMessage
  } = useChats()
  useEffect(() => {
    getFollowedUser()
  }, [])

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleDoubleClick = (messageId) => {
    setEditableMessageId(messageId);
  };

  const handleSingleClick = () => {
    setEditableMessageId(null);
  };

  const handleAttachFile = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file.name);
  };


  const handleClearFile = () => {
    fileInputRef.current.value = ''; // Clear the file input
    setSelectedFileName(null); // Reset selected filename
  };

  const getLastMessage = (currentUser, otherUser) => {
    const userMessages = allmessages.filter(message =>
      (message.senderUsername === currentUser && message.receiverUsername === otherUser) ||
      (message.senderUsername === otherUser && message.receiverUsername === currentUser)
    );

    const unreadMessages = userMessages.filter(message =>
      message.receiverUsername === currentUser && !message.isRead
    );

    const unreadCount = unreadMessages.length;

    if (userMessages.length > 0) {
      const lastMessage = userMessages[userMessages.length - 1];
      return {
        message: lastMessage.message,
        timestamp: lastMessage.timestamp,
        isRead: lastMessage.isRead,
        unreadCount: unreadCount
      };
    }
    return null;
  };





  return (
    <Box height="80vh" display="flex">
      {/* User List Panel */}
      <Box width="25%" border="1px" borderRadius="md" borderTopRightRadius={0} borderBottomRightRadius={0} borderColor="gray.300" overflowY="auto">
        <List spacing={3} p={4}>
          {userList.map((user) => (
            <ListItem
              key={user.id}
              p={2}
              borderRadius={'md'}
              cursor="pointer"
              bg={selectedUser && selectedUser.username === user.username ? 'gray.700' : 'transparent'}
              onClick={() => selectedUser?.username !== user.username && handleUserClick(user)}
            >
              <Flex align="center" position="relative">
                <Avatar size="md" src={user.profileImage} mr={2} />
                <Box position="absolute" top="2" right="0">
                  {user.isLogged ? (
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


      {/* Chat Panel */}
      <Box width="70%" border="1px" borderRadius="md" borderTopLeftRadius={0} borderBottomLeftRadius={0} overflow="hidden">
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          bg="gray.600"
          p="2"
          borderBottom="1px"
          borderColor="gray.300"
        >
          <Flex align="center">
            <Avatar size="md" src={selectedUser && selectedUser.profileImage} mr="2" />
            <Box>
              <Text fontWeight="bold">
                {selectedUser && selectedUser.firstname + ' ' + selectedUser.lastname}
              </Text>
              {selectedUser && (isTyping && typingUser) && (
                <Text fontWeight="bold" color="green.500">
                  Typing...
                </Text>
              )}
              {selectedUser && !(isTyping && typingUser) && (
                <Text fontWeight="bold" color={selectedUser.isLogged ? 'green.500' : 'red.400'}>
                  {selectedUser.isLogged ? 'online' : 'offline'}
                </Text>
              )}
            </Box>
          </Flex>

          <Menu>
            <MenuButton as={IconButton} icon={<Icon as={FaEllipsisH} title="show more" />} />
            <MenuList>
              <MenuItem>Block</MenuItem>
              <MenuItem>Clear chats</MenuItem>
            </MenuList>
          </Menu>
        </Flex>


        {/* Chatbox with scrollable content */}
        <Flex direction="column" height="70vh">
          <Box p="4" flex="1" overflowY="scroll" ref={chatboxRef}>
            {messages.map((message) => (
              <Flex
                key={message._id}
                mb="3"
                justifyContent={message.senderUsername === isUser.username ? 'flex-end' : 'flex-start'}
                alignItems="flex-end"
                style={{
                  transform: editableMessageId === message._id ? `translateX(${message.senderUsername === isUser.username ? '-50px' : '50px'})` : 'none',
                  transition: 'transform 0.3s ease-in-out',
                  position: 'relative',
                }}
                onDoubleClick={() => handleDoubleClick(message._id)}
                onClick={handleSingleClick}
              >
                <Box
                  maxWidth="50%"
                  maxHeight="50%"
                  bg={message.senderUsername === isUser.username ? 'blue.400' : 'gray.200'}
                  color={message.senderUsername === isUser.username ? 'white' : 'black'}
                  p="3"
                  borderRadius="md"
                >
                  {message.contentType === 'text' ? (
                    <Text>{message.message}</Text>
                  ) : message.contentType === 'image' ? (
                    <>
                      <Image src={`${API_HOST}/${message.filepath}`} alt="Image" />
                      {message.message && <Text>{message.message}</Text>}
                    </>
                  ) : message.contentType === 'video' ? (
                    <>
                      <video width="100%" controls>
                        <source src={`${API_HOST}/${message.filepath}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      {message.message && <Text>{message.message}</Text>}
                    </>
                  ) : message.contentType === 'document' ? (
                    <>
                      <Text>{message.contentType}:</Text>
                      <Button
                        as="a"
                        href={`${API_HOST}/${message.filepath}`}
                        target="_blank"
                        download
                        colorScheme="blue"
                        mt="2"
                      >
                        <FaFileDownload />
                      </Button>
                      {message.message && <Text>{message.message}</Text>}
                    </>
                  ) : null}
                  <Text fontSize="xs" color={message.senderUsername === isUser.username ? 'white' : 'black'} textAlign="right">
                    {calculateTimeDifference(message.timestamp)}
                  </Text>
                </Box>

                {/* Delete and Download button */}
                {editableMessageId === message._id && (
                  <Box position="absolute" top="10px" right={message.senderUsername === isUser.username ? '5px' : ''}>
                    <Flex align="center">
                      {message.senderUsername === isUser.username && (
                        <IconButton
                          icon={<FaTrash />}
                          size="sm"
                          aria-label="Delete Message"
                          onClick={() => handleDeleteMessage(message._id, message.roomId)}
                          mr="2"
                        />
                      )}
                      {message.contentType !== 'text' && (
                        <IconButton
                          icon={<FaFileDownload />}
                          color={'black'}
                          size="sm"
                          aria-label="Download Message"
                          onClick={() => dowloadMessageFile(message.filepath)}
                          mr="2"
                        />
                      )}
                    </Flex>
                  </Box>
                )}


              </Flex>
            ))}
          </Box>

          <Divider />

          {/* Input field at bottom of chat card */}
          <Flex p="3">
            <Input
              placeholder="Type your message..."
              variant="filled"
              size="lg"
              flex="1"
              mr="2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage(e.target.value, selectedUser && selectedUser.username);
                  e.target.value = '';
                }
              }}
              onInput={() => checkTyping()}
            />

            <IconButton
              icon={<FaPaperclip />}
              aria-label="Attach file"
              variant="outline"
              size="md"
              onClick={handleAttachFile}
            />
            {selectedFileName && (
              <Button variant="ghost" onClick={handleClearFile}>
                <CloseIcon />
              </Button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />
          </Flex>
          {selectedFileName && (
            <Box p="3">
              <Text>{selectedFileName}</Text>
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default ChatApp;
