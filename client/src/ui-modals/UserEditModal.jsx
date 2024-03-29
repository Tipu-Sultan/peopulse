import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Image,
  Stack,
  HStack,
  Avatar,
  Box,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const { isUser, } = useAuth();
  const { username, firstname, lastname, email, bio } = isUser;
  const [editedUser, setEditedUser] = useState({
    username: username,
    firstname: firstname,
    lastname: lastname,
    email: email,
    bio: bio,
  });

  const handleChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    setEditedUser((prev) => ({ ...prev, [field]: file }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('avatar', editedUser.avatar); 
      formData.append('coverImage', editedUser.coverImage); 

      // Append other fields to formData if needed
      formData.append('username', editedUser.username);
      formData.append('firstname', editedUser.firstname);
      formData.append('lastname', editedUser.lastname);
      formData.append('email', editedUser.email);
      formData.append('bio', editedUser.bio);

      // Send a POST request to your server
      const response = await axios.put(`${API_HOST}/api/auth/saveprofile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      console.log('Server response:', response.data);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <HStack spacing={8} mb={4}>
              <Box>
                <Text>Profile Picture</Text>
                <Avatar src={editedUser.avatar} size="xl" cursor="pointer" onClick={() => document.getElementById('avatarInput').click()} />
                <input type="file" id="avatarInput" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange('avatar', e)} />
              </Box>
              <Box>
                <Text>Banner Image</Text>
                <Image src={editedUser.coverImage} alt="Banner Image" maxH="100px" cursor="pointer" onClick={() => document.getElementById('bannerInput').click()} />
                <input type="file" id="bannerInput" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange('coverImage', e)} />
              </Box>
            </HStack>
            <Input placeholder="Username" value={editedUser.username} onChange={(e) => handleChange('username', e.target.value)} />
            <Input placeholder="First Name" value={editedUser.firstname} onChange={(e) => handleChange('firstname', e.target.value)} />
            <Input placeholder="Last Name" value={editedUser.lastname} onChange={(e) => handleChange('lastname', e.target.value)} />
            <Input placeholder="Email" value={editedUser.email} onChange={(e) => handleChange('email', e.target.value)} />
            <Textarea placeholder="Bio" value={editedUser.bio} onChange={(e) => handleChange('bio', e.target.value)} />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
