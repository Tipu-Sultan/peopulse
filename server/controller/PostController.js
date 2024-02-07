const path = require("path");
const fs = require("fs").promises;
const Post = require("../models/posts");
const UPLOADS_DIR = path.join(__dirname, "../uploads");


async function addPost(req, res) {
    try {
        const { content, contentType, user, username } = req.body;
        const { file } = req;

        let media = null;

        if (file) {
            const mediaBuffer = file.buffer;
            const fileExtension = path.extname(file.originalname);
            const fileName = `${Date.now()}${fileExtension}`;
            const filePath = path.join(UPLOADS_DIR, fileName);

            await fs.writeFile(filePath, mediaBuffer);
            media = `/uploads/${fileName}`;
        }

        const newPostData = {
            user,
            username,
            contentType,
        };

        if (content) {
            newPostData.content = content;
        }
        if (media) {
            newPostData.media = media;
        }

        const newPost = new Post(newPostData);
        await newPost.save();
        res.status(201).json({ newPost, message: "Post created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function likePost(req, res) {
    try {
        const { userID } = req.body;
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const existingLikeIndex = post.likes.findIndex(
            (like) => like.user.toString() === userID.toString()
        );
        if (existingLikeIndex !== -1) {
            post.likes.splice(existingLikeIndex, 1);
        } else {
            post.likes.push({
                user: userID,
                status: true,
            });
        }

        const likedPost = await post.save();
        res.status(200).json({ message: "Likes updated successfully", likedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function addCommentOnPost(req, res) {
    try {
        const { userID,username, text } = req.body;
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({
            user: userID,
            username: username,
            text: text,
        });

        const commentPost = await post.save();
        res.status(200).json({ message: "Comment added successfully", commentPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function deleteComment(req, res) {
    try {
        const postId = req.params.postId;
        const commentId = req.params.cmtId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const commentIndex = post.comments.findIndex(
            (comment) => comment._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        post.comments.splice(commentIndex, 1);

        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await Post.deleteOne({ _id: postId });

        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


async function getAllPost(req, res) {
    try {
        const posts = await Post.find().exec();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    addPost,
    getAllPost,
    likePost,
    addCommentOnPost,
    deleteComment,
    deletePost,
}