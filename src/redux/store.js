import { configureStore } from '@reduxjs/toolkit';
import userReducer from './onlineUserSlice';

const store = configureStore({
  reducer: {
    onlineUsers: userReducer,
  },
});

export default store;
