import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { extendTheme, ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, } from 'react-router-dom';
import { PostProvider } from './context/PostContext';
import { FollowProvider } from './context/FollowContext';
import { ChatsProvider } from './context/ChatsContext';
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <PostProvider>
          <FollowProvider>
            <ChatsProvider>
              <ChakraProvider theme={theme}>
                <App />
              </ChakraProvider>
            </ChatsProvider>
          </FollowProvider>
        </PostProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

