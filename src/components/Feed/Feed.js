import React, { useState, useEffect } from 'react';
import './Feed.css';
import Post from '../Post/Post';
import { client } from '../../utils/client';
import { listPostsWithUser } from '../../graphql/custom-queries';
import { onCreatePost } from '../../graphql/subscriptions'; // Import the subscription

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();

    // Set up the subscription
    const subscription = client.graphql({
      query: onCreatePost
    }).subscribe({
      next: ({ data }) => {
        const newPost = data.onCreatePost;
        // Avoid adding a post that's already in the list
        setPosts(prevPosts => {
          if (prevPosts.find(p => p.id === newPost.id)) {
            return prevPosts;
          }
          return [newPost, ...prevPosts];
        });
      },
      error: (error) => console.error('Subscription error:', error)
    });

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe();

  }, []);

  async function fetchPosts() {
    try {
      const postData = await client.graphql({
        query: listPostsWithUser
      });
      const posts = postData.data.listPosts.items;
      setPosts(posts);
      setLoading(false);
    } catch (err) {
      console.log('error fetching posts', err);
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="feed-message">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className="feed-message">No posts yet. Be the first to post!</div>;
  }

  return (
    <div className="feed">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;
