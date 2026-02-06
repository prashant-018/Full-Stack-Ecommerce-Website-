import React, { useState, useEffect, useContext } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import ReviewsSummary from './ReviewsSummary';
import './ProductReviews.css';

const ProductReviews = ({ productId, productName }) => {
  const { user } = useContext(SessionContext);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [sizeFitStats, setSizeFitStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, filterRating, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sortBy
      });

      if (filterRating) {
        params.append('rating', filterRating);
      }

      const response = await fetch(`/api/reviews/${productId}?${params}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setRatingStats(data.ratingStats);
        setSizeFitStats(data.sizeFitStats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setShowReviewForm(false);
    fetchReviews(); // Refresh to get updated stats
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleRatingFilter = (rating) => {
    setFilterRating(filterRating === rating ? null : rating);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to reviews section
    document.getElementById('reviews-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div id="reviews-section" className="product-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        {user && (
          <button
            className="write-review-btn"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </button>
        )}
        {!user && (
          <p className="login-prompt">
            <a href="/login">Sign in</a> to write a review
          </p>
        )}
      </div>

      {ratingStats && (
        <ReviewsSummary
          ratingStats={ratingStats}
          sizeFitStats={sizeFitStats}
          onRatingFilter={handleRatingFilter}
          activeFilter={filterRating}
        />
      )}

      <div className="reviews-controls">
        <div className="sort-controls">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {filterRating && (
          <div className="active-filters">
            <span className="filter-tag">
              {filterRating} Star{filterRating !== 1 ? 's' : ''}
              <button onClick={() => handleRatingFilter(null)}>×</button>
            </span>
          </div>
        )}
      </div>

      <ReviewsList
        reviews={reviews}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {showReviewForm && (
        <ReviewForm
          productId={productId}
          productName={productName}
          onClose={() => setShowReviewForm(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default ProductReviews;