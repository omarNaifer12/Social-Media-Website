// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './component/Home/Home';
import CreatePost from './component/CreatePost/CreatePost';
import './App.css';

function App() {
	return (
		<Router>
			<div className="app">
				<nav className="navbar">
					<ul className="nav-list">
						<li className="nav-item">
							<Link to="/" className="nav-link">Home</Link>
						</li>
						<li className="nav-item">
							<Link to="/create" className="nav-link">Create Post</Link>
						</li>
					</ul>
				</nav>
				<div className="content">
					<Routes>
						<Route path="/create" element={<CreatePost />} />
						<Route path="/edit/:postId" element={<CreatePost />} />
						<Route path="/" element={<Home />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
