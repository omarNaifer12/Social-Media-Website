import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './CreatePost.css';

function CreateOrUpdatePost() {
	const { postId } = useParams();
	const [post, setPost] = useState({
		title: "",
		content: "",
		file: null,
	});
	const navigate = useNavigate();

	useEffect(() => {
		if (postId) {
			axios
				.get(`http://localhost:3000/api/posts/${postId}`)
				.then((response) => {
					setPost({ title: response.data.title, content: response.data.content, file: null });
				})
				.catch((error) => console.error("Error fetching post:", error));
		}
	}, [postId]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setPost({ ...post, [name]: value });
	};

	const handleFileChange = (event) => {
		setPost({ ...post, file: event.target.files[0] });
	};

	const handlePostSubmit = () => {
		const formData = new FormData();
		formData.append("title", post.title);
		formData.append("content", post.content);
		if (post.file) {
			formData.append("file", post.file);
		}

		const url = postId
			? `http://localhost:3000/api/posts/update/${postId}`
			: "http://localhost:3000/api/posts/add";

		axios
			.post(url, formData)
			.then(() => {
				navigate("/");
			})
			.catch((error) => console.error("Error submitting post:", error));
	};

	return (
		<div className="create-or-update-post">
			<h2>{postId ? "Update Post" : "Create a Post"}</h2>
			<div className="form-group">
				<label htmlFor="title">Title</label>
				<input
					type="text"
					id="title"
					name="title"
					placeholder="Title"
					value={post.title}
					onChange={handleInputChange}
					className="form-control"
				/>
			</div>
			<div className="form-group">
				<label htmlFor="content">Content</label>
				<textarea
					id="content"
					name="content"
					placeholder="Content"
					value={post.content}
					onChange={handleInputChange}
					className="form-control"
				></textarea>
			</div>
			<div className="form-group">
				<label htmlFor="file">Upload Image</label>
				<input
					type="file"
					id="file"
					name="file"
					onChange={handleFileChange}
					className="form-control"
				/>
			</div>
			<button onClick={handlePostSubmit} className="submit-button">
				{postId ? "Update" : "Post"}
			</button>
		</div>
	);
}

export default CreateOrUpdatePost;
