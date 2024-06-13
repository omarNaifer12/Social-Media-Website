const express = require('express');
const postController=require("../controllers/postController");
const router=express.Router();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const upload = multer({ storage: storage });
router.get("/all", postController.getPosts);
router.get("/:postId", postController.getPostById);
router.post("/add", upload.single("file"), postController.addPost);
router.post("/update/:postId", upload.single("file"), postController.updatePost);
router.delete("/delete/:postId", postController.deletePost);
router.post("/like/:postId", postController.likeOnPost);
router.post("/comment/:postId", postController.commentOnPost);
module.exports=router;