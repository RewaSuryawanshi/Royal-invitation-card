import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ColorTheme } from '../types';
import { Sparkles, Eye, Wind, Layers } from 'lucide-react';

interface ThreeDThemeLayerProps {
  theme: ColorTheme;
  children: React.ReactNode;
  enableTilt?: boolean;
  enableParticles?: boolean;
  className?: string;
  onThemeSwitch?: (themeId: string) => void;
  available3DThemes?: ColorTheme[];
}

interface Particle {
  x: number;
  y: number;
  z: number; // Depth (0.2 to 1.8)
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  swayOffset: number;
  swaySpeed: number;
  opacity: number;
  type: 'marigold' | 'mirror' | 'diya' | 'lotus' | 'sparkle' | 'rose' | 'leaf';
  color: string;
}

export const ThreeDThemeLayer: React.FC<ThreeDThemeLayerProps> = ({
  theme,
  children,
  enableTilt = true,
  enableParticles = true,
  className = '',
  onThemeSwitch,
  available3DThemes = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Parallax State
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [particlesActive, setParticlesActive] = useState(enableParticles);
  const [depthActive, setDepthActive] = useState(enableTilt);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Mouse / Touch interaction for 3D tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!depthActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized -1 to +1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Subtle 3D tilt angles (max 6 degrees for elegant feel)
    const rotateY = normX * 5;
    const rotateX = -normY * 5;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  }, [depthActive]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  }, []);

  // Canvas Particle Animation
  useEffect(() => {
    if (!particlesActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Seed theme-specific particles
    const particleType = theme.particlesType || 'marigold';
    const particleCount = width < 640 ? 22 : 45;
    const particles: Particle[] = [];

    const getColors = () => {
      switch (particleType) {
        case 'marigold':
          return ['#FF9900', '#FFB703', '#FB8500', '#F35B04', '#FFD166'];
        case 'mirrors':
          return ['#E8F1F5', '#D4AF37', '#FFFFFF', '#A9D6E5', '#E63946'];
        case 'diyas':
          return ['#FFB703', '#FB8500', '#FF4800', '#FFD166', '#FFE6A7'];
        case 'lotus':
          return ['#F72585', '#B5179E', '#7209B7', '#4CC9F0', '#E2AFFC'];
        default:
          return ['#D4AF37', '#FFF3B0', '#E09F3E', '#FFFFFF'];
      }
    };

    const colors = getColors();

    for (let i = 0; i < particleCount; i++) {
      const z = Math.random() * 1.5 + 0.5; // Depth multiplier
      let type: Particle['type'] = 'sparkle';
      if (particleType === 'marigold') {
        type = Math.random() > 0.2 ? 'marigold' : 'sparkle';
      } else if (particleType === 'mirrors') {
        type = Math.random() > 0.4 ? 'mirror' : (Math.random() > 0.5 ? 'rose' : 'sparkle');
      } else if (particleType === 'diyas') {
        type = Math.random() > 0.35 ? 'diya' : 'sparkle';
      } else if (particleType === 'lotus') {
        type = Math.random() > 0.4 ? 'lotus' : (Math.random() > 0.5 ? 'leaf' : 'sparkle');
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size: (Math.random() * 8 + 8) * z,
        speedX: (Math.random() - 0.5) * 0.8 * z,
        speedY: (Math.random() * 0.8 + 0.4) * z,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        swayOffset: Math.random() * 10,
        swaySpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.5 + 0.4,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Render loop
    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(tick * p.swaySpeed + p.swayOffset) * 0.6;
        p.rotation += p.rotationSpeed;

        // Wrap around borders
        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x < -40) p.x = width + 30;
        if (p.x > width + 40) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'marigold') {
          // 3D Marigold petal drawing
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.8, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          // Inner petal vein
          ctx.beginPath();
          ctx.moveTo(-p.size * 0.6, 0);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.strokeStyle = 'rgba(255, 230, 150, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (p.type === 'mirror') {
          // Sheesh Mahal convex mirror shard
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.6);
          ctx.lineTo(p.size * 0.5, 0);
          ctx.lineTo(0, p.size * 0.6);
          ctx.lineTo(-p.size * 0.5, 0);
          ctx.closePath();
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Glint sparkle
          if (Math.sin(tick * 0.05 + p.swayOffset) > 0.7) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (p.type === 'diya') {
          // Floating Diya flame & vessel
          // Base
          ctx.beginPath();
          ctx.ellipse(0, p.size * 0.2, p.size * 0.6, p.size * 0.25, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#8B4513';
          ctx.fill();
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Glowing Flame
          const flameFlicker = Math.sin(tick * 0.2 + p.swayOffset) * 2;
          ctx.beginPath();
          ctx.moveTo(-p.size * 0.2, p.size * 0.1);
          ctx.quadraticCurveTo(0, -p.size * 0.8 + flameFlicker, p.size * 0.2, p.size * 0.1);
          ctx.closePath();
          const grad = ctx.createLinearGradient(0, p.size * 0.1, 0, -p.size * 0.8);
          grad.addColorStop(0, '#FF4500');
          grad.addColorStop(0.5, '#FFD700');
          grad.addColorStop(1, '#FFFFFF');
          ctx.fillStyle = grad;
          ctx.fill();
        } else if (p.type === 'lotus') {
          // Floating Lotus petal
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.7);
          ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.3, p.size * 0.4, p.size * 0.6, 0, p.size * 0.7);
          ctx.bezierCurveTo(-p.size * 0.4, p.size * 0.6, -p.size * 0.6, -p.size * 0.3, 0, -p.size * 0.7);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else if (p.type === 'rose') {
          // Romantic red rose petal
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI, false);
          ctx.quadraticCurveTo(p.size * 0.5, -p.size * 0.4, 0, -p.size * 0.6);
          ctx.quadraticCurveTo(-p.size * 0.5, -p.size * 0.4, 0, 0);
          ctx.fillStyle = '#C9184A';
          ctx.fill();
        } else if (p.type === 'leaf') {
          // Kashmiri golden chinar leaf silhouette
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.25, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = '#DDA15E';
          ctx.fill();
        } else {
          // Golden stardust sparkle
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [particlesActive, theme.particlesType]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden transition-transform duration-200 ease-out ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Backdrop Scenic Rendering */}
      {theme.bgImageUrl && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 transition-transform duration-500 ease-out"
          style={{
            backgroundImage: `url(${theme.bgImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.45,
            transform: depthActive
              ? `scale(1.08) translate3d(${tilt.y * 1.5}px, ${-tilt.x * 1.5}px, -40px)`
              : 'scale(1.04)',
            filter: 'contrast(1.08) saturate(1.15)',
          }}
        />
      )}

      {/* Atmospheric Depth Vignette & Color Gradients */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, transparent 20%, ${theme.maroonDeep} 95%)`,
          opacity: 0.85,
        }}
      />

      {/* Interactive 3D Golden Light Glare */}
      {depthActive && (
        <div
          className="absolute inset-0 pointer-events-none z-2 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 600px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 230, 160, 0.18) 0%, transparent 60%)`,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Floating 3D Animated Canvas Particles */}
      {particlesActive && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10 w-full h-full"
        />
      )}

      {/* Architectural 3D Foreground Arch & Ornaments */}
      {theme.archType === 'udaipur-jharokha' && (
        <div className="absolute top-0 inset-x-0 h-28 pointer-events-none z-15 flex justify-center opacity-85">
          <svg viewBox="0 0 1200 120" className="w-full h-full preserve-3d" fill="none">
            <defs>
              <linearGradient id="udaipurGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8A6820" />
                <stop offset="50%" stopColor="#FFDF73" />
                <stop offset="100%" stopColor="#8A6820" />
              </linearGradient>
              <filter id="archShadow" x="-10%" y="-10%" width="120%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
              </filter>
            </defs>
            <path
              d="M0,0 L1200,0 L1200,30 Q900,30 800,55 Q600,110 400,55 Q300,30 0,30 Z"
              fill="url(#udaipurGold)"
              filter="url(#archShadow)"
            />
            {/* Scalloped jharokha notches */}
            <path
              d="M350,55 Q400,90 450,55 Q500,90 550,55 Q600,95 650,55 Q700,90 750,55 Q800,90 850,55"
              stroke="#581020"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>
      )}

      {theme.archType === 'sheesh-mahal' && (
        <div className="absolute top-0 inset-x-0 h-28 pointer-events-none z-15 flex justify-center opacity-85">
          <svg viewBox="0 0 1200 120" className="w-full h-full preserve-3d" fill="none">
            <defs>
              <linearGradient id="sheeshMirror" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B2B1E" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#0B2B1E" />
              </linearGradient>
            </defs>
            <path
              d="M0,0 L1200,0 L1200,20 Q850,20 750,50 Q600,105 450,50 Q350,20 0,20 Z"
              fill="url(#sheeshMirror)"
              stroke="#E8D288"
              strokeWidth="2"
            />
            {/* Mirror facets */}
            <circle cx="600" cy="55" r="12" fill="#E8D288" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="530" cy="45" r="8" fill="#E8D288" />
            <circle cx="670" cy="45" r="8" fill="#E8D288" />
          </svg>
        </div>
      )}

      {theme.archType === 'varanasi-mandap' && (
        <div className="absolute top-0 inset-x-0 h-28 pointer-events-none z-15 flex justify-center opacity-85">
          <svg viewBox="0 0 1200 120" className="w-full h-full preserve-3d" fill="none">
            <defs>
              <linearGradient id="varanasiBrass" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#50170A" />
                <stop offset="50%" stopColor="#FFD166" />
                <stop offset="100%" stopColor="#50170A" />
              </linearGradient>
            </defs>
            <path
              d="M0,0 L1200,0 L1200,25 Q950,25 780,45 Q600,100 420,45 Q250,25 0,25 Z"
              fill="url(#varanasiBrass)"
              stroke="#E59500"
              strokeWidth="2.5"
            />
            {/* Hanging ceremonial bells */}
            <path d="M600,25 L600,65 M500,25 L500,55 M700,25 L700,55" stroke="#FFD166" strokeWidth="2" />
            <circle cx="600" cy="72" r="7" fill="#E59500" stroke="#FFE6A7" />
            <circle cx="500" cy="62" r="5" fill="#E59500" stroke="#FFE6A7" />
            <circle cx="700" cy="62" r="5" fill="#E59500" stroke="#FFE6A7" />
          </svg>
        </div>
      )}

      {theme.archType === 'mughal-jali' && (
        <div className="absolute top-0 inset-x-0 h-28 pointer-events-none z-15 flex justify-center opacity-85">
          <svg viewBox="0 0 1200 120" className="w-full h-full preserve-3d" fill="none">
            <defs>
              <linearGradient id="mughalTurquoise" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#113537" />
                <stop offset="50%" stopColor="#F3E5AB" />
                <stop offset="100%" stopColor="#113537" />
              </linearGradient>
            </defs>
            <path
              d="M0,0 L1200,0 L1200,20 Q800,20 700,48 Q600,98 500,48 Q400,20 0,20 Z"
              fill="url(#mughalTurquoise)"
              stroke="#D4AF37"
              strokeWidth="2"
            />
            {/* Mughal Lotus Arch Finial */}
            <path d="M600,98 L600,112 M590,105 Q600,92 610,105" stroke="#F3E5AB" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}

      {/* Main Content with 3D Depth Transform */}
      <div
        className="relative z-5 transition-transform duration-200 ease-out"
        style={{
          transform: depthActive
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`
            : 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>

      {/* Floating 3D Experience Controls Pill (Compact & Elegant) */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-40 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setParticlesActive(!particlesActive)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md border transition-all cursor-pointer shadow-md ${
            particlesActive
              ? 'bg-amber-500/25 border-amber-300/80 text-amber-200'
              : 'bg-black/40 border-white/20 text-stone-300'
          }`}
          title="Toggle 3D Floating Petals / Particles"
        >
          <Wind className={`w-3 h-3 ${particlesActive ? 'text-amber-300 animate-spin' : ''}`} />
          <span className="hidden sm:inline">3D Petals</span>
        </button>

        <button
          type="button"
          onClick={() => setDepthActive(!depthActive)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md border transition-all cursor-pointer shadow-md ${
            depthActive
              ? 'bg-amber-500/25 border-amber-300/80 text-amber-200'
              : 'bg-black/40 border-white/20 text-stone-300'
          }`}
          title="Toggle 3D Tilt Parallax"
        >
          <Layers className="w-3 h-3 text-amber-300" />
          <span className="hidden sm:inline">3D Depth</span>
        </button>

        {onThemeSwitch && available3DThemes.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-amber-600/80 to-amber-800/80 text-white border border-amber-300/70 backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{theme.name.replace(' 3D', '')}</span>
              <span className="text-[9px] bg-amber-400 text-stone-950 font-bold px-1 rounded">3D</span>
            </button>

            {/* Quick 3D Theme Switcher Dropdown */}
            {showThemePicker && (
              <div 
                className="absolute top-full left-0 mt-2 w-72 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl border text-left z-50 animate-in fade-in zoom-in-95 duration-200"
                style={{
                  backgroundColor: 'rgba(26, 18, 16, 0.95)',
                  borderColor: 'rgba(212, 175, 55, 0.5)',
                }}
              >
                <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-300/80 px-2 py-1 mb-1 border-b border-amber-400/20 flex items-center justify-between">
                  <span>3D Indian Wedding Themes</span>
                  <span className="text-[9px] text-stone-400">Live Switch</span>
                </div>
                <div className="space-y-1">
                  {available3DThemes.map((t) => {
                    const isSelected = t.id === theme.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          onThemeSwitch(t.id);
                          setShowThemePicker(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400/20 border border-amber-400/60 text-white'
                            : 'hover:bg-white/10 text-stone-200 border border-transparent'
                        }`}
                      >
                        {t.bgImageUrl && (
                          <img
                            src={t.bgImageUrl}
                            alt={t.name}
                            className="w-10 h-10 rounded-lg object-cover border border-amber-300/40 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-xs font-semibold text-amber-200 truncate flex items-center gap-1.5">
                            <span>{t.name}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                          </div>
                          <div className="text-[10px] text-stone-300/80 truncate">
                            {t.styleTag || 'Indian Royal Heritage'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
