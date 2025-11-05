import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../../utils/client';
import { getUser, postsByOwnerAndCreatedAt } from '../../graphql/queries';
import { updateUser } from '../../graphql/mutations';
import PostGridItem from './PostGridItem';
import './Profile.css';

function Profile({ loggedInUser }) {
  const [viewedUser, setViewedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', bio: '' });

  const { username: userId } = useParams(); // Renamed for clarity

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await client.graphql({ query: getUser, variables: { id: userId } });
        const user = userData.data.getUser;
        setViewedUser(user);
        setFormData({ username: user.username, bio: user.bio || '' });

        if (user) {
          const postData = await client.graphql({ 
            query: postsByOwnerAndCreatedAt, 
            variables: { owner: user.id, sortDirection: 'DESC' } 
          });
          setPosts(postData.data.postsByOwnerAndCreatedAt.items);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { id, createdAt, updatedAt, owner, posts, likes, comments, ...rest } = viewedUser;
      const input = {
        id,
        username: formData.username,
        bio: formData.bio,
      };
      const result = await client.graphql({ 
        query: updateUser, 
        variables: { input }
      });
      setViewedUser(result.data.updateUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const isOwnProfile = loggedInUser?.id === viewedUser?.id;

  if (loading) return <p>Loading...</p>;
  if (!viewedUser) return <p>User not found.</p>;

  return (
    <div className="profile">
      <div className="profile-header">
        <img src={viewedUser.avatar || '/default-avatar.png'} alt={`${viewedUser.username}'s avatar`} className="profile-avatar" />
        <div className="profile-info">
          {isEditing ? (
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="profile-edit-input" />
          ) : (
            <h2>{viewedUser.username}</h2>
          )}
          
          <div className="profile-stats">
            <span><b>{posts.length}</b> posts</span>
            <span><b>0</b> followers</span>
            <span><b>0</b> following</span>
          </div>

          {isEditing ? (
            <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="profile-edit-textarea" />
          ) : (
            <p>{viewedUser.bio}</p>
          )}

          {isOwnProfile && (
            <div className="profile-edit-buttons">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="profile-button">Save</button>
                  <button onClick={() => setIsEditing(false)} className="profile-button secondary">Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="profile-button">Edit Profile</button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="profile-posts-grid">
        {posts.map(post => (
          <PostGridItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Profile;
