import React from 'react';
import StarRating from './StarRating';
import './ReviewsSummary.css';

const ReviewsSummary = ({ ratingStats, sizeFitStats, onRatingFilter, activeFilter }) => {
  const { averageRating, totalReviews, distribution } = ratingStats;

  const getBarWidth = (count) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  const getSizeFitRecommendation = () => {
    if (!sizeFitStats || sizeFitStats.percentage === 0) {
      return { text: 'No size feedback yet', percentage: 0 };
    }

    const { recommendation, percentage } = sizeFitStats;
    return { text: recommendation, percentage };
  };

  const sizeFitInfo = getSizeFitRecommendation();

  return (
    <div className="reviews-summary">
      <div className="rating-overview">
        <div className="overall-rating">
          <div className="rating-number">{averageRating.toFixed(1)}</div>
          <div className="rating-stars">
            <StarRating rating={averageRating} size="large" />
          </div>
          <div className="total-reviews">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map(rating => (
            <div
              key={rating}
              className={`rating-bar-row ${activeFilter === rating ? 'active' : ''}`}
              onClick={() => onRatingFilter(rating)}
            >
              <span className="rating-label">{rating}★</span>
              <div className="rating-bar">
                <div
                  className="rating-fill"
                  style={{ width: `${getBarWidth(distribution[rating])}%` }}
                />
              </div>
              <span className="rating-count">{distribution[rating]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="size-fit-summary">
        <h4>Size & Fit</h4>
        <div className="size-fit-indicator">
          <div className="size-fit-scale">
            <div className="scale-labels">
              <span>Runs Small</span>
              <span>True to Size</span>
              <span>Runs Large</span>
            </div>
            <div className="scale-bar">
              <div
                className={`scale-indicator ${sizeFitInfo.text.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  left: sizeFitInfo.text === 'Runs Small' ? '16.67%' :
                    sizeFitInfo.text === 'True to Size' ? '50%' : '83.33%'
                }}
              />
            </div>
          </div>
          <div className="size-fit-text">
            {sizeFitInfo.percentage > 0 ? (
              <>
                <strong>{sizeFitInfo.percentage}%</strong> say it{' '}
                <strong>{sizeFitInfo.text.toLowerCase()}</strong>
              </>
            ) : (
              <span className="no-feedback">No size feedback yet</span>
            )}
          </div>
        </div>

        {sizeFitStats && sizeFitStats.breakdown && (
          <div className="size-fit-breakdown">
            {Object.entries(sizeFitStats.breakdown).map(([fit, count]) => (
              count > 0 && (
                <div key={fit} className="fit-stat">
                  <span className="fit-label">{fit}:</span>
                  <span className="fit-count">{count}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSummary;