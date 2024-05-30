import { CloseIcon } from '@chakra-ui/icons';
import { Button, Flex, IconButton, Input } from '@chakra-ui/react';
import React from 'react'
import { FaPaperclip, FaRegPaperPlane } from 'react-icons/fa';
import { useChats } from '../context/ChatsContext';

const ChatInput = () => {
    const {
        checkTyping, handleSendClick, fileInputRef,
        selectedFileName,
        setSelectedFile,
        setSelectedFileName,
        selectedUser, handleSendMessage,
        messageText, setMessageText
    } = useChats();
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
    return (
        <Flex p="3">
            <Input
                placeholder="Type your message..."
                variant="filled"
                size="lg"
                flex="1"
                mr="2"
                value={messageText}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage(messageText, selectedUser && selectedUser.username);
                        setMessageText('')
                    }
                }}
                onChange={(e) => setMessageText(e.target.value)}
                onInput={() => checkTyping()}
            />
            <IconButton
                mt={1}
                variant="ghost"
                icon={<FaRegPaperPlane />}
                onClick={handleSendClick}
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
    )
}

export default ChatInput