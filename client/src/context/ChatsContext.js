import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import socket from '../services/socket';
const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
    const API_HOST = process.env.REACT_APP_API_HOST;
    const token = localStorage.getItem("token");
    const isLogin = localStorage.getItem("userData");
    const isUser = isLogin ? JSON.parse(isLogin) : null;
    const [messages, setMessages] = useState([])
    const [userList, setUserList] = useState([])
    const [selectedUser, setSelectedUser] = useState(null);
    const fileInputRef = useRef(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [editableMessageId, setEditableMessageId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isTyping, setIsTyping] = useState(null);
    const [typingUser, setTypingUser] = useState(null);



    const handleSendMessage = async (messageText, receiverUsername) => {
        try {
            if (!messageText.trim()) {
                return;
            }

            const roomId = [isUser.username, receiverUsername].sort().join('@');

            const formData = new FormData();
            formData.append('message', messageText);
            formData.append('roomId', roomId);
            formData.append('senderUsername', isUser.username);
            formData.append('receiverUsername', receiverUsername);

            // Add file to formData if selectedFile is present
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await axios.post(`${API_HOST}/api/chats`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const savedMessage = response.data.newMessage;
            socket.emit('privateMessage', savedMessage);

            // Reset selectedFile and fileName after sending the message
            setSelectedFile(null);
            setSelectedFileName('');

        } catch (error) {
            console.error('Error storing chat message:', error);
        }
    };



    const getFollowedUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_HOST}/api/chats/followed-user-details/${isUser.username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserList(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const getAllSenderReciverMsg = async (senderUsername, receiverUsername) => {
        try {
            const request = {
                senderUsername: senderUsername,
                receiverUsername: receiverUsername,
            };
            const response = await axios.post(`${API_HOST}/api/chats/get-messages`, request, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages(response.data.chats);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };


    const handleUserClick = (user) => {
        const roomId = [isUser.username, user.username].sort().join('@');
        setSelectedUser(user);
        getAllSenderReciverMsg(isUser.username, user.username)
        socket.emit('joinRoom', roomId);
    };

    const handleDeleteMessage = async (msgId, roomId) => {
        try {
            setMessages((prevMessages) => prevMessages.filter((message) => message._id !== msgId));
            await axios.delete(`${API_HOST}/api/chats/delete-message/${msgId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            socket.emit("deletedMessage", { msgId, roomId });
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    function dowloadMessageFile(filepath) {
        const downloadLink = document.createElement('a');
        downloadLink.href = API_HOST + '/' + filepath;
        downloadLink.target = '_blank'; // Open the link in a new tab
        downloadLink.download = 'file'; // You can set the default file name here

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    const checkTyping = () => {
        setIsTyping(true);
        const roomId = [isUser.username, selectedUser?.username].sort().join('@');
        socket.emit('privateTyping', { roomId, isTyping: true, senderUsername: isUser.username });
    };

    useEffect(() => {
        const typingTimeout = setTimeout(() => {
            setIsTyping(false);
        }, 2000);

        return () => clearTimeout(typingTimeout);
    }, [isTyping]);

    useEffect(() => {
        // Listen for new messages
        socket.on('message', (savedMessage) => {
            setMessages((prevMessages) => [...prevMessages, savedMessage]);
        });

        socket.on('isTyping', ({ isTyping, senderUsername }) => {
            if (isTyping) {
                setIsTyping(true);
                setTypingUser(senderUsername);
            } else {
                setIsTyping(false);
                setTypingUser(null);
            }
        });

        // Listen for deleted messages
        socket.on('deletedMessage', (msgId) => {
            const updatedMessages = messages.filter((message) => message._id !== msgId);
            setMessages(updatedMessages);
        });

        // Clean up event listeners on component unmount
        return () => {
            socket.off('message');
            socket.off('isTyping');
            socket.off('deletedMessage');
            socket.off('joinRoom');
        };
    }, [messages]);



    return (
        <ChatsContext.Provider
            value={{
                checkTyping,
                isTyping,
                typingUser,
                dowloadMessageFile,
                fileInputRef,
                selectedFileName,
                editableMessageId,
                setEditableMessageId,
                handleSendMessage,
                setSelectedFile,
                setSelectedFileName,
                messages,
                isUser,
                userList,
                selectedUser,
                handleUserClick,
                getFollowedUser,
                setMessages,
                handleDeleteMessage,
            }}
        >
            {children}
        </ChatsContext.Provider>
    );
};

export const useChats = () => {
    const context = useContext(ChatsContext);
    if (!context) {
        throw new Error('useChats must be used within an AuthProvider');
    }
    return context;
};
