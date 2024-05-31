import { Box, Button, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { FaFileDownload, FaTrash } from 'react-icons/fa'
import { useChats } from '../context/ChatsContext';
import { calculateTimeDifference } from '../services/timeConvert';

const ChatBox = () => {
    const {
        dowloadMessageFile, editableMessageId, isUser, messages,
        handleDeleteMessage, chatboxRef, API_HOST, setEditableMessageId
    } = useChats();
    const handleDoubleClick = (messageId) => {
        setEditableMessageId(messageId);
    };

    const handleSingleClick = () => {
        setEditableMessageId(null);
    };
    return (
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
                                        onClick={() => handleDeleteMessage(message._id, message.receiverUsername)}
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
    )
}

export default ChatBox