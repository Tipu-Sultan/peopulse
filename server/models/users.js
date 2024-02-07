const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  bio: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  lastMessage:{
    type: String,
    default: '',
  },
  followers: [
    {
      senderUsername: {
        type: String,
        required: true,
      },
      receiverUsername: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'confirmed'],
        default: 'pending',
      },
      action: {
        type: String,
        enum: ['Requested', 'Follow', 'Following'],
        required: true,
      },
    }

  ],
  following: [
    {
      senderUsername: {
        type: String,
        required: true,
      },
      receiverUsername: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'confirmed'],
        default: 'pending',
      },
      action: {
        type: String,
        enum: ['Requested', 'Following'],
        required: true,
      },
    }
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  token: {
    type: String,
    default: '',
  },
  otp: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
  access: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
