import React from 'react';
import './Post.css';

function Post({ post }) {
  // The 'post' prop will come from the Feed component
  // It will contain details like owner, content, etc.
  
  return (
    <article className="post">
      <header className="post-header">
        <div className="post-avatar"></div>
        <div className="post-owner">{post.owner}</div>
      </header>
      <div className="post-content">
        {/* Assuming content is just text for now */}
        <p>{post.content}</p>
      </div>
      <footer className="post-footer">
        {/* Action buttons will go here (Like, Comment) */}
      </footer>
    </article>
  );
}

export default Post;
