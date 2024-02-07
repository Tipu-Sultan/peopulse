const Friends = require('../models/friends');
const User = require('../models/users');

async function makeFollowRequest(req, res) {
  const { senderUsername, receiverUsername, action } = req.body;

  try {
    // Check if the sender and receiver exist
    const sender = await User.findOne({ username: senderUsername }).select('-password -otp -token');
    const receiver = await User.findOne({ username: receiverUsername }).select('-password -otp -token');

    if (action === 'Cancel') {
      await Friends.findOneAndDelete({
        senderUsername: sender.username,
        receiverUsername: receiver.username,
      });
      receiver.followers = receiver.followers.filter(
        (follower) =>
          !(follower.senderUsername === sender.username && follower.receiverUsername === receiver.username)
      );

      // Delete from sender's following array
      sender.following = sender.following.filter(
        (follow) =>
          !(follow.senderUsername === sender.username && follow.receiverUsername === receiver.username)
      );

    } else if (action === 'Delete') {
      await Friends.deleteMany({
        $or: [
          {
            senderUsername: receiver.username,
            receiverUsername: sender.username,
          },
          {
            senderUsername: sender.username,
            receiverUsername: receiver.username,
          },
        ],
      });


      sender.followers = receiver.followers.filter(
        (follower) =>
          !(follower.senderUsername === receiver.username && follower.receiverUsername === sender.username)
      );

      // Delete from sender's following array
      receiver.following = sender.following.filter(
        (follow) =>
          !(follow.senderUsername === receiver.username && follow.receiverUsername === sender.username)
      );

      receiver.followers = sender.followers.filter(
        (follower) =>
          !(follower.senderUsername === sender.username && follower.receiverUsername === receiver.username)
      );

      // Delete from sender's following array
      sender.following = receiver.following.filter(
        (follow) =>
          !(follow.senderUsername === sender.username && follow.receiverUsername === receiver.username)
      );

    }
    else if (action === 'Requested') {

      // Check if the relationship already exists
      const existingRelationship = await Friends.findOne({
        $or: [
          {
            senderUsername: receiver.username,
            receiverUsername: sender.username,
          },
          {
            senderUsername: sender.username,
            receiverUsername: receiver.username,
          },
        ],
      });

      // If the relationship doesn't exist, insert new data
      if (!existingRelationship) {
        const newRelationship = new Friends({
          senderUsername: sender.username,
          receiverUsername: receiver.username,
          status: 'pending',
          action: action,
        });
        await newRelationship.save();

        sender.following.push({
          senderUsername: sender.username,
          receiverUsername: receiver.username,
          status: 'pending',
          action: action,
        });

        receiver.followers.push({
          senderUsername: sender.username,
          receiverUsername: receiver.username,
          status: 'pending',
          action: action,
        });
      }

    } else if (action === 'Following') {
      // Find the existing relationship in Friends collection
      const existingRelationship = await Friends.findOne({
        senderUsername: receiver.username,
        receiverUsername: sender.username,
      });

      // Update the status and action in Friends collection
      if (existingRelationship) {
        existingRelationship.status = 'confirmed';
        existingRelationship.action = action;
        await existingRelationship.save();
      }

      // Update the status and action in sender's following array
      const senderFollowing = receiver.following.find(
        (follow) =>
          follow.senderUsername === receiver.username && follow.receiverUsername === sender.username
      );
      if (senderFollowing) {
        senderFollowing.status = 'confirmed';
        senderFollowing.action = action;
      }

      // Update the status and action in receiver's followers array
      const receiverFollower = sender.followers.find(
        (follow) =>
          follow.senderUsername === receiver.username && follow.receiverUsername === sender.username
      );
      if (receiverFollower) {
        receiverFollower.status = 'confirmed';
        receiverFollower.action = action;
      }
    }


    const followedbySender = await sender.save();
    const followingbyreceiver = await receiver.save();
    res.status(201).json({ message: `Follow request ${action} successfully.`, followedbySender, followingbyreceiver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  makeFollowRequest,
};
