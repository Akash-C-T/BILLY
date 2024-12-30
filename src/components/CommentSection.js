import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CommentSection = () => {
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [comments, setComments] = useState([]);
  const [warningCount, setWarningCount] = useState(0);
  const [isSuspended, setIsSuspended] = useState(false);
  const [userId, setUserId] = useState('user1'); // Replace with actual user id logic

  const PERSPECTIVE_API_KEY = 'AIzaSyDbBNNSmdc5tfiaUks_uwMHl3i5WjZGUdM';
  const navigate = useNavigate();

  useEffect(() => {
    const checkSuspension = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/check-suspension/${userId}`);
        setIsSuspended(response.data.isSuspended);
        if (response.data.isSuspended) {
          setFeedback('❌ You have been suspended for 7 days due to multiple violations.');
          setTimeout(() => {
            navigate('/'); // Redirect to AuthForm after 3 seconds
          }, 3000);
        }
      } catch (error) {
        console.error('Error fetching suspension status:', error);
      }
    };

    checkSuspension();
  }, [userId, navigate]);

  const analyzeComment = async (commentText) => {
    try {
      const response = await axios.post(
        `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`,
        {
          comment: { text: commentText },
          languages: ['en'],
          requestedAttributes: {
            TOXICITY: {},
          },
        }
      );
      const toxicityScore = response.data.attributeScores.TOXICITY.summaryScore.value;
      return toxicityScore;
    } catch (error) {
      console.error('Error analyzing comment:', error);
      return null;
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (isSuspended) {
      setFeedback('❌ Your account is suspended for 7 days due to multiple violations.');
      return;
    }

    try {
      const toxicityScore = await analyzeComment(comment);

      if (toxicityScore !== null) {
        if (toxicityScore >= 0.7) {
          setWarningCount((prevCount) => prevCount + 1);

          if (warningCount + 1 >= 3) {
            setFeedback('❌ You have been suspended for 7 days due to multiple violations.');
            await axios.post('http://127.0.0.1:5000/suspend-user', { userId, suspensionDuration: 7 });
            setIsSuspended(true);
            setTimeout(() => {
              navigate('/'); // Redirect to AuthForm after 3 seconds
            }, 3000);
          } else {
            setFeedback(`⚠️ Toxic comment detected. Warning ${warningCount + 1}/3`);
          }
        } else {
          setComments([...comments, comment]);
          setFeedback('✅ Comment added successfully!');
        }
      } else {
        setFeedback('❌ Error analyzing comment. Please try again.');
      }

      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setFeedback('❌ Error submitting comment. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* Text "Post" above the image */}
      <h2>Post</h2>
      
      {/* Bot image above the comment section with increased size */}
      <img
        src="https://img.freepik.com/free-photo/ai-cybersecurity-virus-protection-machine-learning_53876-129788.jpg?t=st=1735139356~exp=1735142956~hmac=eebfc1c63d5923c8f3bd9eafaa2534d7042bde212635982358f218505cceb3a7&w=740"
        alt="Bot Icon"
        style={{
          width: '300px',  // Adjusted width to make the image larger
          height: '300px', // Adjusted height to maintain aspect ratio
          marginBottom: '20px',
        }} 
      />
      <h1>Comments</h1>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="Add your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          cols="50"
          disabled={isSuspended}
        />
        <br />
        <button type="submit" disabled={isSuspended}>
          Submit Comment
        </button>
      </form>
      {feedback && <p>{feedback}</p>}
      <div>
        <h2>All Comments</h2>
        <ul>
          {comments.map((cmt, idx) => (
            <li key={idx}>{cmt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommentSection;
