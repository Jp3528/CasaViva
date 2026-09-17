import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: number;
  showText?: boolean;
  totalReviews?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  interactive = false,
  onRatingChange,
  size = 16,
  showText = false,
  totalReviews,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'inline-flex', gap: '2px' }}>
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                padding: interactive ? '2px' : 0,
                color: isFilled ? '#D4A347' : '#D1CECA',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label={`${starValue} estrellas`}
            >
              <Star
                size={size}
                fill={isFilled ? '#D4A347' : 'none'}
                stroke={isFilled ? '#D4A347' : '#B8B4AE'}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--cv-text-muted)', marginLeft: '4px' }}>
          {rating.toFixed(1)} {totalReviews !== undefined && `(${totalReviews})`}
        </span>
      )}
    </div>
  );
};
