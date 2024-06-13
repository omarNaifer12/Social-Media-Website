const Post=require("../models/postModel");
const fs = require('fs');
const path = require('path');
const getPosts= async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const addPost= async (req, res) => {
    try {
        const { title, content } = req.body;
        const file = req.file ? req.file.filename : undefined;
 
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required fields' });
        }
 
        const post = new Post({ title, content, file });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
 
const likeOnPost= async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
 
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
 
        post.likes += 1;
        await post.save();
 
        res.json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
 
const commentOnPost= async (req, res) => {
    try {
        const postId = req.params.postId;
        const { text } = req.body;
        const post = await Post.findById(postId);
 
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
 
        post.comments.push({ text });
        await post.save();
 
        res.json(post);
    } catch (error) {
      console.error('Error adding comment:',error);
    res.status(500).json({ error: 'Internal Server Error'});
    }
}
const updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;
        const file = req.file ? req.file.filename : undefined;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Delete old file if a new file is uploaded
        if (file && post.file) {
            const oldFilePath = path.join(__dirname, '../uploads', post.file);
            fs.unlink(oldFilePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.file = file || post.file;
        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Delete file associated with the post
        if (post.file) {
            const filePath = path.join(__dirname, '../uploads', post.file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports={getPosts,addPost,likeOnPost,commentOnPost,getPostById,updatePost,
    deletePost,};