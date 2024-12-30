import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig'; // Import Firebase config
import { collection, getDocs, addDoc } from 'firebase/firestore';

const PostComments = () => {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const postsCol = collection(db, 'posts'); // Get the 'posts' collection
      const postSnapshot = await getDocs(postsCol);
      const postsList = postSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
      setLoading(false);
    };
    
    fetchPosts();
  }, []);

  // Handle comment submission
  const handleCommentSubmit = async (postId) => {
    if (comment.trim()) {
      try {
        const user = auth.currentUser;
        if (user) {
          const commentsRef = collection(db, 'posts', postId, 'comments'); // Get the 'comments' sub-collection of the post
          await addDoc(commentsRef, {
            user: user.email,
            comment,
            timestamp: new Date(),
          });
          setComment(''); // Clear the comment input after submission
        } else {
          alert('Please login to comment!');
        }
      } catch (error) {
        console.error('Error adding comment: ', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.map(post => (
          <div key={post.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>

            {/* Display Comments */}
            <div>
              <h3>Comments</h3>
              <Comments postId={post.id} />
            </div>

            {/* Add Comment Form */}
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                rows="4"
                style={{ width: '100%', padding: '10px' }}
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                style={{ marginTop: '10px', padding: '10px', backgroundColor: 'blue', color: 'white' }}
              >
                Post Comment
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Comment display logic (Fetches comments)
const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsRef = collection(db, 'posts', postId, 'comments'); // Access the 'comments' sub-collection for a specific post
      const commentsSnapshot = await getDocs(commentsRef);
      const commentsList = commentsSnapshot.docs.map(doc => doc.data());
      setComments(commentsList);
    };

    fetchComments();
  }, [postId]);

  return (
    <div>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment, index) => (
          <div key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <strong>{comment.user}</strong>: {comment.comment}
          </div>
        ))
      )}
    </div>
  );
};

export default PostComments;
