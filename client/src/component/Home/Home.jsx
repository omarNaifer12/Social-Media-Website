import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Home.css';

function Home() {
	const [commentInput, setCommentInput] = useState("");
	const [posts, setPosts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get("http://localhost:3000/api/posts/all")
			.then((response) => {
				setPosts(response.data);
				console.log("files is", response.data);
			})
			.catch((error) => console.error("Error fetching posts:", error));
	}, []);

	const handleLike = (postId) => {
		axios
			.post(`http://localhost:3000/api/posts/like/${postId}`)
			.then((response) => {
				const updatedPosts = posts.map((post) =>
					post._id === postId ? response.data : post
				);
				setPosts(updatedPosts);
			})
			.catch((error) => console.error("Error liking post:", error));
	};

	const handleAddComment = (postId, commentText) => {
		axios
			.post(`http://localhost:3000/api/posts/comment/${postId}`, { text: commentText })
			.then((response) => {
				const updatedPosts = posts.map((post) =>
					post._id === postId ? response.data : post
				);
				setPosts(updatedPosts);
				setCommentInput("");
			})
			.catch((error) => console.error("Error adding comment:", error));
	};

	const handleDeletePost = (postId) => {
		const shouldDelete = window.confirm("Are you sure you want to delete this post?");
		if (shouldDelete) {
			axios
				.delete(`http://localhost:3000/api/posts/delete/${postId}`)
				.then(() => {
					setPosts(posts.filter((post) => post._id !== postId));
				})
				.catch((error) => console.error("Error deleting post:", error));
		}	};

	const handleEditPost = (postId) => {
		navigate(`/edit/${postId}`);
	};

	return (
		<div className="home">
			<h2>Recent Posts</h2>
			<button className="add-post-button" onClick={() => navigate("/add")}>Add Post</button>
			<div className="posts-container">
				{posts.map((post) => (
					<article key={post._id} className="post">
						<h3 className="post-title">{post.title}</h3>
						<p className="post-content">{post.content}</p>
						{post.file && (
							<div className="post-image">
								<img
									src={`http://localhost:3000/api/posts/uploads/${post.file}`}
									alt="Post Media"
								/>
							</div>
						)}
						<div className="post-interactions">
							<p>Likes: {post.likes}</p>
							<button className="like-button" onClick={() => handleLike(post._id)}>Like</button>
							<button className="delete-button" onClick={() => handleDeletePost(post._id)}>Delete</button>
							<button className="edit-button" onClick={() => handleEditPost(post._id)}>Edit</button>
						</div>
						<div className="comments-section">
							<p>Comments: {post.comments.length}</p>
							<ul className="comments-list">
								{post.comments.map((comment, index) => (
									<li key={index} className="comment">{comment.text}</li>
								))}
							</ul>
							<div className="comment-input-container">
								<input
									type="text"
									placeholder="Add a comment"
									className="comment-input"
									onChange={(e) => setCommentInput(e.target.value)}
									value={commentInput}
								/>
								<button
									onClick={() => handleAddComment(post._id, commentInput)}
									className="comment-button"
								>
									Add Comment
								</button>
							</div>
						</div>
					</article>
				))}
			</div>
		</div>
	);
}

export default Home;
