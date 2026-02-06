import React, { useState, useContext } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import StarRating from './StarRating';
import './ReviewForm.css';

const ReviewForm = ({ productId, productName, onClose, onReviewSubmitted }) => {
  const { user } = useContext(SessionContext);
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    sizeFit: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));

    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rating) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a review title';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Please enter your review';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }

    if (!formData.sizeFit) {
      newErrors.sizeFit = 'Please select size fit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        onReviewSubmitted(data.review);
        onClose();
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ submit: 'Failed to submit review. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-modal">
        <div className="review-form-header">
          <h3>Write a Review</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="product-info">
          <p>Reviewing: <strong>{productName}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Overall Rating *</label>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              interactive={true}
              size="large"
            />
            {errors.rating && <span className="error">{errors.rating}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Review Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Summarize your experience"
              maxLength={100}
              className={errors.title ? 'error' : ''}
            />
            <div className="char-count">{formData.title.length}/100</div>
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review *</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Tell others about your experience with this product..."
              rows={5}
              maxLength={1000}
              className={errors.comment ? 'error' : ''}
            />
            <div className="char-count">{formData.comment.length}/1000</div>
            {errors.comment && <span className="error">{errors.comment}</span>}
          </div>

          <div className="form-group">
            <label>Size Fit *</label>
            <div className="size-fit-options">
              {['Runs Small', 'True to Size', 'Runs Large'].map(option => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="sizeFit"
                    value={option}
                    checked={formData.sizeFit === option}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">{option}</span>
                </label>
              ))}
            </div>
            {errors.sizeFit && <span className="error">{errors.sizeFit}</span>}
          </div>

          {errors.submit && (
            <div className="form-error">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;