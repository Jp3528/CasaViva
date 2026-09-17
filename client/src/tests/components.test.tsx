import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../components/ui/Badge';
import { RatingStars } from '../components/ui/RatingStars';
import { EmptyState } from '../components/ui/EmptyState';

describe('Componentes Visuales de CasaViva', () => {
  it('Renderiza Badge con estado de oferta', () => {
    render(<Badge state="Oferta" />);
    expect(screen.getByText('Oferta')).toBeInTheDocument();
  });

  it('Renderiza RatingStars con calificación numérica', () => {
    render(<RatingStars rating={4.8} showText totalReviews={25} />);
    expect(screen.getByText(/4.8/)).toBeInTheDocument();
    expect(screen.getByText(/(25)/)).toBeInTheDocument();
  });

  it('Renderiza EmptyState con título y descripción', () => {
    render(
      <EmptyState
        title="Sin resultados"
        description="No encontramos productos coincidentes."
      />
    );
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    expect(screen.getByText('No encontramos productos coincidentes.')).toBeInTheDocument();
  });
});
