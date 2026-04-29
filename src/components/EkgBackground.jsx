// src/components/EkgBackground.jsx
import React, { useRef, useEffect } from 'react';

const EkgBackground = ({ color = 'green' }) => {
  const lineColor = color === 'red' ? '#ff4d4d' : '#4ade80';
  const pathRef = useRef(null);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.setProperty('--path-length', length);
      pathRef.current.style.strokeDasharray = length;
      pathRef.current.style.strokeDashoffset = length;
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1] opacity-30">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="ekg-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="1200" height="600" fill="transparent" />
        <path
          ref={pathRef}
          className="ekg-path"
          d="M 0 300 
             L 487.5 300 
             L 537.5 300 
             L 542.5 300 
             L 552.5 100 
             L 562.5 500 
             L 572.5 300 
             L 582.5 300 
             L 592.5 300 
             L 602.5 300 
             L 612.5 100 
             L 622.5 500 
             L 632.5 300 
             L 642.5 300 
             L 652.5 300 
             L 662.5 300 
             L 672.5 100 
             L 682.5 500 
             L 692.5 300 
             L 702.5 300 
             L 712.5 300 
             L 1200 300"
          stroke={lineColor}
          strokeWidth="2"
          fill="none"
          filter="url(#ekg-glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <style>{`
        .ekg-path {
          animation: ekg-draw 8s linear infinite;
        }
        @keyframes ekg-draw {
          0% {
            stroke-dashoffset: var(--path-length);
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default EkgBackground;