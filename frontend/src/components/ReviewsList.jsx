import React, { useState } from 'react';
import StarRating from './StarRating';
import './ReviewsList.css';
import API_URL from '../config/api';

const ReviewsList = ({ reviews, loading, pagination, onPageChange }) => {
  const [helpfulClicks, setHelpfulClicks] = useState({});

  const handleHelpfulClick = async (reviewId) => {
    if (helpfulClicks[reviewId]) return; // Prevent multiple clicks

    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
        method: 'PUT',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setHelpfulClicks(prev => ({
          ...prev,
          [reviewId]: true
        }));
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;
    const pages = [];

    // Calculate page range to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Adjust range if we're near the beginning or end
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    // Previous button
    if (hasPrevPage) {
      pages.push(
        <button
          key="prev"
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹ Previous
        </button>
      );
    }

    // First page and ellipsis
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-btn"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (hasNextPage) {
      pages.push(
        <button
          key="next"
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next ›
        </button>
      );
    }

    return (
      <div className="pagination">
        {pages}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <div className="no-reviews-icon">📝</div>
        <h3>No reviews yet</h3>
        <p>Be the first to share your thoughts about this product!</p>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      <div className="reviews-count">
        {pagination && (
          <p>
            Showing {((pagination.currentPage - 1) * 10) + 1}-
            {Math.min(pagination.currentPage * 10, pagination.totalReviews)} of{' '}
            {pagination.totalReviews} reviews
          </p>
        )}
      </div>

      <div className="reviews-items">
        {reviews.map((review) => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-name">
                  {review.userName}
                  {review.verifiedBuyer && (
                    <span className="verified-badge" title="Verified Buyer">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="review-meta">
                  <StarRating rating={review.rating} size="small" />
                  <span className="review-date">{review.timeAgo}</span>
                </div>
              </div>
              <div className="size-fit-badge">
                Size fit: <strong>{review.sizeFit}</strong>
              </div>
            </div>

            <div className="review-content">
              <h4 className="review-title">{review.title}</h4>
              <p className="review-comment">{review.comment}</p>
            </div>

            <div className="review-actions">
              <button
                className={`helpful-btn ${helpfulClicks[review._id] ? 'clicked' : ''}`}
                onClick={() => handleHelpfulClick(review._id)}
                disabled={helpfulClicks[review._id]}
              >
                👍 Helpful ({review.helpfulCount + (helpfulClicks[review._id] ? 1 : 0)})
              </button>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
};

export default ReviewsList;