import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import socket from '../services/socket';
const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
    const API_HOST = process.env.REACT_APP_API_HOST;
    const chatboxRef = useRef(null);
    const token = localStorage.getItem("token");
    const isLogin = localStorage.getItem("userData");
    const isUser = isLogin ? JSON.parse(isLogin) : null;
    const [messages, setMessages] = useState([])
    const [allmessages, setAllMessages] = useState([])
    const [userList, setUserList] = useState([])
    const [selectedUser, setSelectedUser] = useState(null);
    const fileInputRef = useRef(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [editableMessageId, setEditableMessageId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isTyping, setIsTyping] = useState(null);
    const [typingUser, setTypingUser] = useState(null);
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const [messageText, setMessageText] = useState('')
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


    const handleSendMessage = async (messageText, receiverUsername) => {
        try {
            if (!messageText.trim()&& !selectedFile) {
                return;
            }
            const roomId = [isUser.username, receiverUsername].sort().join('_');

            const formData = new FormData();
            formData.append('roomId', roomId);
            formData.append('senderUsername', isUser.username);
            formData.append('receiverUsername', receiverUsername);

            // Add file to formData if selectedFile is present
            if (messageText!=='') {
                formData.append('message', messageText);
            }
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

    const handleSendClick = () => {
        handleSendMessage(messageText, selectedUser && selectedUser.username);
        setMessageText(''); 
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
        setSelectedUser(user);
        getAllSenderReciverMsg(isUser.username, user.username)
        socket.emit('joinRoom', { sender: isUser.username, receiver: user.username });
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
        const roomId = [isUser.username, selectedUser?.username].sort().join('_');
        socket.emit('privateTyping', { roomId, isTyping: true, senderUsername: selectedUser.username });
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


    useEffect(() => {
        const fetchMessages = async () => {
          try {
            const response = await axios.get(`${API_HOST}/api/chats/get-allmessages`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setAllMessages(response.data);
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        };
    
        fetchMessages();
      }, [API_HOST, selectedUser, token]);

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
                setIsTyping(isTyping);
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
        };
    }, [messages]);



    return (
        <ChatsContext.Provider
            value={{
                chatboxRef,
                API_HOST,
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
                allmessages,
                isUser,
                userList,
                selectedUser,
                handleUserClick,
                getFollowedUser,
                setMessages,
                handleDeleteMessage,
                isUserListOpen, 
                setIsUserListOpen,
                getLastMessage,
                handleSendClick,
                isMobile, 
                setIsMobile,
                messageText, 
                setMessageText
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
