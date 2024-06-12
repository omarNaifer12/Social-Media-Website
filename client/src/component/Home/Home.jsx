// Home.js

import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
	const [commentInput, setCommentInput] = useState("");
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		axios
			.get("http://localhost:3000/api/posts/all")
			.then((response) => {setPosts(response.data)
				console.log("files is",response.data);
			})
			.catch((error) => console.error("Error fetching posts:", error));
	}, []);

	const handleLike = (postId) => {
		axios
			.post(`http://localhost:3000/api/posts/like/${postId}`)
			.then((response) => {
				const updatedPosts = posts. map((post) =>
					post._id === postId ? response.data : post
				);
				setPosts(updatedPosts);
			})
			.catch((error) => console.error("Error liking post:", error));
	};

	const handleAddComment = (postId, commentText) => {
		axios
			.post(`http://localhost:3000/api/posts/comment/${postId}`, {
				text: commentText,
			})
			.then((response) => {
				const updatedPosts = posts.map((post) =>
					post._id === postId ? response.data : post
				);
				setPosts(updatedPosts);
			})
			.catch((error) => console.error("Error adding comment:", error));
	};

	return (
		<div className="home">
			<h2>Recent Posts</h2>
			{posts.map((post) => (
				<div key={post._id} className="post">
					<h3>{post.title}</h3>
					<p>{post.content}</p>
					{post.file&& (
						<div>
							{ (
								<img
									src={
									`http://localhost:3000/api/posts/uploads/${post.file}`
									}
									alt="Post Media"
								/>
							)}
						</div>
					)}
					<p>Likes:{post.likes}</p>
					<button onClick={() => handleLike(post._id)}>Like</button>
					<p>Comments: {post.comments.length}</p>
					<ul>
						{post.comments.map((comment, index) => (
							<li key={index}>{comment.text}</li>
						))}
					</ul>

					<input
						type="text"
						placeholder="Add a comment"
						className="comment-input"
						onChange={(e) => setCommentInput(e.target.value)}
					/>
					<button
						onClick={() => handleAddComment(post._id, commentInput)}
						className="comment-button"
					>
						Add Comment
					</button>
				</div>
			))}
		</div>
	);
}

export default Home;
