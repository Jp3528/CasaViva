import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const galleryList = images.length > 0 ? images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Main Big Image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '4/3',
          backgroundColor: 'var(--cv-bg-warm)',
          borderRadius: 'var(--cv-radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--cv-border-subtle)',
          boxShadow: 'var(--cv-shadow-sm)',
        }}
      >
        <img
          src={galleryList[selectedIndex]}
          alt={`${productName} - Vista ${selectedIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>

      {/* Thumbnails Row */}
      {galleryList.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {galleryList.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: 'var(--cv-radius-md)',
                  overflow: 'hidden',
                  border: isSelected ? '2px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                  outline: isSelected ? '2px solid rgba(83, 99, 75, 0.25)' : 'none',
                  flexShrink: 0,
                  opacity: isSelected ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
              >
                <img src={img} alt={`Miniatura ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
