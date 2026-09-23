import React, { useEffect, useRef } from 'react';
import { ColorTheme } from '../types';

interface ThreeDParticleCanvasProps {
  theme: ColorTheme;
  density?: 'subtle' | 'medium';
  className?: string;
}

export const ThreeDParticleCanvas: React.FC<ThreeDParticleCanvasProps> = ({
  theme,
  density = 'subtle',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = density === 'subtle' ? 18 : 30;
    const particleType = theme.particlesType || 'marigold';

    const getPalette = () => {
      switch (particleType) {
        case 'marigold':
          return ['#FFAA00', '#FFD166', '#FF8500', '#FFE6A7'];
        case 'mirrors':
          return ['#FFFFFF', '#D4AF37', '#80E5A7', '#E8D288'];
        case 'diyas':
          return ['#FFB703', '#FB8500', '#FF4800', '#FFD166'];
        case 'lotus':
          return ['#F72585', '#72DDF7', '#D4AF37', '#F3C5D9'];
        default:
          return ['#D4AF37', '#FFF3B0', '#FFFFFF'];
      }
    };

    const colors = getPalette();

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 4,
      speedY: Math.random() * 0.45 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.4 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(tick * p.swaySpeed + p.swayOffset) * 0.5;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (particleType === 'marigold' || particleType === 'lotus') {
          // Petal oval
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (particleType === 'mirrors') {
          // Diamond glint
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.6, 0);
          ctx.closePath();
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // Soft golden spark
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme.particlesType]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full z-0 ${className}`}
    />
  );
};
