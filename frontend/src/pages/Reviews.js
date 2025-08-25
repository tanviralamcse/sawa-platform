import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import ReviewForm from '../components/ReviewForm';
import { buildApiUrl } from '../config/api';

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      let url = buildApiUrl('reviews/');
      
      if (filter === 'given') {
        url += '?type=given';
      } else if (filter === 'received') {
        url += '?type=received';
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.results || data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [filter, fetchReviews]);

  const StarRating = ({ rating, size = 'normal' }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i <= rating ? 'filled' : ''} ${size}`}
        >
          ⭐
        </span>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  const ReviewCard = ({ review }) => {
    const isGiven = review.reviewer?.id === user?.id;
    const otherUser = isGiven ? review.reviewed_user : review.reviewer;

    return (
      <div className="review-card">
        <div className="review-header">
          <div className="review-user">
            <div className="user-avatar">
              {otherUser?.first_name?.[0] || 'U'}
            </div>
            <div className="user-info">
              <h4>{otherUser?.first_name} {otherUser?.last_name}</h4>
              <p className="user-role">
                {isGiven ? 'You reviewed' : 'Reviewed you'}
              </p>
            </div>
          </div>
          <div className="review-meta">
            <StarRating rating={review.rating} />
            <span className="review-date">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="review-content">
          <div className="review-project">
            <strong>Project:</strong> {review.service_request_title || review.service_request?.title}
          </div>
          
          {review.comment && (
            <div className="review-comment">
              <p>"{review.comment}"</p>
            </div>
          )}

          <div className="review-categories">
            {review.communication_rating && (
              <div className="category-rating">
                <span>Communication:</span>
                <StarRating rating={review.communication_rating} size="small" />
              </div>
            )}
            {review.quality_rating && (
              <div className="category-rating">
                <span>Quality:</span>
                <StarRating rating={review.quality_rating} size="small" />
              </div>
            )}
            {review.timeliness_rating && (
              <div className="category-rating">
                <span>Timeliness:</span>
                <StarRating rating={review.timeliness_rating} size="small" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const calculateAverageRating = () => {
    const receivedReviews = reviews.filter(review => review.reviewed_user?.id === user?.id);
    if (receivedReviews.length === 0) return 0;
    
    const total = receivedReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / receivedReviews.length).toFixed(1);
  };

  if (showReviewForm) {
    return (
      <div className="reviews-page">
        <div className="page-header">
          <button 
            className="btn-back"
            onClick={() => {
              setShowReviewForm(false);
              setSelectedProject(null);
            }}
          >
            ← Back to Reviews
          </button>
          <h1>Leave a Review</h1>
        </div>
        <ReviewForm 
          project={selectedProject}
          onComplete={() => {
            setShowReviewForm(false);
            setSelectedProject(null);
            fetchReviews();
          }}
        />
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="page-header">
        <h1>Reviews</h1>
        <div className="rating-summary">
          <div className="average-rating">
            <StarRating rating={Math.round(calculateAverageRating())} />
            <span className="rating-text">
              {calculateAverageRating()} ({reviews.filter(r => r.reviewed_user?.id === user?.id).length} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="page-filters">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Reviews
          </button>
          <button 
            className={`filter-tab ${filter === 'received' ? 'active' : ''}`}
            onClick={() => setFilter('received')}
          >
            Received
          </button>
          <button 
            className={`filter-tab ${filter === 'given' ? 'active' : ''}`}
            onClick={() => setFilter('given')}
          >
            Given
          </button>
        </div>
      </div>

      <div className="reviews-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : (
          <>
            {/* Pending Reviews Section */}
            <div className="pending-reviews-section">
              <h2>Pending Reviews</h2>
              <div className="pending-reviews">
                {/* This would be populated with completed projects needing reviews */}
                <div className="no-pending">
                  <p>No pending reviews at the moment.</p>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="reviews-list-section">
              <h2>
                {filter === 'received' ? 'Reviews You\'ve Received' : 
                 filter === 'given' ? 'Reviews You\'ve Given' : 'All Reviews'}
              </h2>
              
              {reviews.length > 0 ? (
                <div className="reviews-grid">
                  {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">⭐</div>
                  <h3>No reviews yet</h3>
                  <p>
                    {filter === 'received' 
                      ? "You haven't received any reviews yet. Complete some projects to get reviews!"
                      : filter === 'given'
                      ? "You haven't given any reviews yet. Complete projects and leave reviews for others!"
                      : "No reviews to display. Start completing projects to build your reputation!"
                    }
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
