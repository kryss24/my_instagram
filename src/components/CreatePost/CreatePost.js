import React, { useState } from 'react';
import './CreatePost.css';
import { generateClient } from 'aws-amplify/api'; // Correct v6 import
import { createPost } from '../../graphql/mutations';

const client = generateClient(); // Create the client

function CreatePost({ user, onPostCreated }) { // Accept onPostCreated prop
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const postDetails = {
        type: 'TEXT', // For now, all posts are TEXT
        content: content,
        owner: user.userId, // Corrected: use user.userId
        // createdAt and updatedAt are now automatically handled by the @model directive
      };
      // Correct v6 API call
      await client.graphql({
        query: createPost,
        variables: { input: postDetails }
      });
      setContent(''); // Clear input after successful post
      if (onPostCreated) { // Call onPostCreated if provided
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <form className="create-post-form" onSubmit={handleSubmit}>
        <textarea
          className="create-post-textarea"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
          disabled={loading}
        ></textarea>
        <button type="submit" className="create-post-button" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
