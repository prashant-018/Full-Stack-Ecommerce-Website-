import React, { useState, useEffect, useContext } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import StarRating from './StarRating';
import './AdminReviews.css';
import API_URL from '../config/api';

const AdminReviews = () => {
  const { user } = useContext(SessionContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    fetchReviews();
  }, [currentPage, statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        status: statusFilter
      });

      const response = await fetch(`${API_URL}/reviews/admin/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching admin reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [reviewId]: true }));

    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setReviews(prev => prev.filter(review => review._id !== reviewId));
      } else {
        alert('Failed to delete review: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;
    const pages = [];

    if (hasPrevPage) {
      pages.push(
        <button
          key="prev"
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ‹ Previous
        </button>
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pages.push(
          <button
            key={i}
            className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pages.push(<span key={`ellipsis-${i}`} className="pagination-ellipsis">...</span>);
      }
    }

    if (hasNextPage) {
      pages.push(
        <button
          key="next"
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next ›
        </button>
      );
    }

    return <div className="pagination">{pages}</div>;
  };

  if (loading) {
    return (
      <div className="admin-reviews-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="admin-reviews">
      <div className="admin-reviews-header">
        <h2>Review Management</h2>
        <div className="reviews-stats">
          <span>Total Reviews: {pagination?.totalReviews || 0}</span>
        </div>
      </div>

      <div className="admin-reviews-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews found.</p>
        </div>
      ) : (
        <>
          <div className="admin-reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="admin-review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-details">
                      <strong>{review.userName}</strong>
                      {review.verifiedBuyer && (
                        <span className="verified-badge">✓ Verified</span>
                      )}
                    </div>
                    <div className="review-meta">
                      <StarRating rating={review.rating} size="small" />
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="review-actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={deleteLoading[review._id]}
                    >
                      {deleteLoading[review._id] ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <div className="product-details">
                    {review.productId?.images?.[0] && (
                      <img
                        src={review.productId.images[0].url}
                        alt={review.productId.name}
                        className="product-thumbnail"
                      />
                    )}
                    <div>
                      <strong>{review.productId?.name || 'Product not found'}</strong>
                      <div className="size-fit">Size fit: {review.sizeFit}</div>
                    </div>
                  </div>
                </div>

                <div className="review-content">
                  <h4>{review.title}</h4>
                  <p>{review.comment}</p>
                </div>

                <div className="review-stats">
                  <span>Helpful: {review.helpfulCount}</span>
                  {review.reportCount > 0 && (
                    <span className="reports">Reports: {review.reportCount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default AdminReviews;