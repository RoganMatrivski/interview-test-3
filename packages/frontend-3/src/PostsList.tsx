import type React from "react";
import { useEffect, useState } from "react";

// Define the type for a post
type Post = {
	userId: number;
	id: number;
	title: string;
	body: string;
};

function PostsList() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					"https://jsonplaceholder.typicode.com/posts",
				);

				if (!response.ok) {
					throw new Error(`Error ${response.status}: ${response.statusText}`);
				}

				const data: Post[] = await response.json();
				setPosts(data);
				setError(null);
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (err: any) {
				setError(err.message || "Unknown error");
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	if (loading) return <p>Loading posts...</p>;
	if (error) return <p>Error loading posts: {error}</p>;

	return (
		<div>
			<h2>Posts</h2>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<strong>{post.title}</strong>
						<p>{post.body}</p>
					</li>
				))}
			</ul>
		</div>
	);
}

export default PostsList;
