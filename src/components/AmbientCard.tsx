import React from 'react';

interface AmbientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 'sm' | 'md' | 'lg' | 'pulse' | 'none';
  interactive?: boolean;
  glowAccentColor?: string; // Optional custom glow color
  className?: string;
  isQuoteCard?: boolean;
}

export const AmbientCard: React.FC<AmbientCardProps> = ({
  children,
  elevation = 'md',
  interactive = false,
  glowAccentColor,
  className = '',
  isQuoteCard = false,
  style = {},
  ...props
}) => {
  const getElevationClass = () => {
    if (elevation === 'none') return '';
    if (elevation === 'pulse') return 'ambient-glow-pulse glowing-card';
    if (elevation === 'sm') return interactive ? 'ambient-glow-interactive' : 'ambient-glow-sm';
    if (elevation === 'lg') return interactive ? 'ambient-glow-interactive glowing-card' : 'ambient-glow-lg glowing-card';
    return interactive ? 'ambient-glow-interactive' : 'ambient-glow-md';
  };

  const dynamicStyle: React.CSSProperties = {
    background: isQuoteCard ? 'var(--quote-card-gradient)' : 'var(--card-gradient)',
    border: '1px solid var(--border-color)',
    ...style
  };

  if (glowAccentColor) {
    dynamicStyle['--glow-color' as any] = glowAccentColor;
    dynamicStyle['--glow-accent' as any] = glowAccentColor;
  }

  return (
    <div
      className={`rounded-3xl transition-all duration-300 backdrop-blur-md relative overflow-hidden ${isQuoteCard ? 'glowing-card' : ''} ${getElevationClass()} ${className}`}
      style={dynamicStyle}
      {...props}
    >
      {/* Subtle ambient interior illumination edge */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-3xl opacity-50"
        style={{
          background: 'radial-gradient(ellipse at top left, var(--glow-accent) 0%, transparent 70%)'
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
