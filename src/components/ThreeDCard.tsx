import React, { useRef, useState, useCallback } from 'react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // max tilt degrees (default 12)
  glare?: boolean;
  scale?: number; // hover scale (default 1.03)
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = '',
  depth = 10,
  glare = true,
  scale = 1.03,
  onClick,
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    const rotY = normX * depth;
    const rotX = -normY * depth;

    setTransform(
      `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.35,
      });
    }
  }, [depth, glare, scale]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        ...style,
        transform,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Children content (can use transform: translateZ(...) for 3D pop) */}
      <div className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>

      {/* Dynamic Specular Holographic Glare */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 overflow-hidden z-30"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 235, 170, 0.45) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 80%)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Golden Edge 3D Bevel Glow on Hover */}
      <div 
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 z-20 border border-amber-300/40"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered ? '0 16px 36px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.25)' : 'none',
        }}
      />
    </div>
  );
};
