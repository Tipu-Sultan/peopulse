const express = require("express");
const multer = require("multer");
const { addPost, likePost, getAllPost,addCommentOnPost, deleteComment, deletePost} = require("../controller/PostController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/addpost",authMiddleware, upload.single("file"), addPost);

router.post("/like/:postId",authMiddleware,likePost);

router.post("/add-comment/:postId", authMiddleware,addCommentOnPost);

router.delete("/delete-comment/:postId/:cmtId", authMiddleware,deleteComment);

router.delete("/delete-post/:postId", authMiddleware,deletePost);


router.get("/getposts",authMiddleware,getAllPost);





module.exports = router;
