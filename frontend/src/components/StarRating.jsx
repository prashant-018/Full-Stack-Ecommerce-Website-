import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({
  rating = 0,
  onRatingChange,
  interactive = false,
  size = 'medium',
  showCount = false,
  reviewCount = 0
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = interactive ? (hoverRating || rating) : rating;

  return (
    <div className={`star-rating ${size} ${interactive ? 'interactive' : ''}`}>
      <div className="stars" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= displayRating ? 'filled' : ''}`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={!interactive}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>

      {showCount && reviewCount > 0 && (
        <span className="review-count">
          ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
        </span>
      )}

      {interactive && displayRating > 0 && (
        <span className="rating-text">
          {displayRating} star{displayRating !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default StarRating;