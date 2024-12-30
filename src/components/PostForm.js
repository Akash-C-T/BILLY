// src/components/PostForm.js
import React, { useState } from 'react';

const PostForm = () => {
  const [image, setImage] = useState(null); // For storing the selected image preview
  const [caption, setCaption] = useState('');
  const [comments, setComments] = useState([]); // Store the list of comments
  const [newComment, setNewComment] = useState(''); // Store the new comment being typed

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a preview URL
      setImage(imageUrl);
    }
  };

  // Handle caption change
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  // Handle new comment change
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Add a new comment to the list
  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]); // Add the new comment to the list
      setNewComment(''); // Clear the comment input field
    }
  };

  return (
    <div className="post-form-container">
      <h2>Create a Post</h2>

      {/* Image upload and preview */}
      <div className="image-upload-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {image && (
          <div className="image-preview">
            <img src={image} alt="Preview" style={{ width: '200px', height: '200px' }} />
          </div>
        )}
      </div>

      {/* Caption input */}
      <textarea
        value={caption}
        onChange={handleCaptionChange}
        placeholder="Write a caption"
        rows="4"
        cols="50"
      />

      <button onClick={() => alert('Post Created!')}>Create Post</button>

      {/* Comment section */}
      <div className="comments-section">
        <h3>Comments</h3>

        {/* New comment input */}
        <input
          type="text"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Write a comment"
        />
        <button onClick={addComment}>Add Comment</button>

        {/* Displaying the comments */}
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostForm;
