"use client";

import { useEditorStore, LayoutType } from "@/store/useEditorStore";
import { motion, AnimatePresence } from "framer-motion";
import { DraggableImage } from "./DraggableImage";
import React from "react";

export function CollageGrid() {
  const { images, layout, spacing, borderRadius, aspectRatio, backgroundColor } = useEditorStore();

  const aspectMap: Record<string, string> = {
    '1:1': '1 / 1',
    '4:5': '4 / 5',
    '16:9': '16 / 9',
    '9:16': '9 / 16',
    '3:4': '3 / 4',
    '4:3': '4 / 3',
    'auto': 'auto'
  };

  const ratioMap: Record<string, number> = {
    '1:1': 1,
    '4:5': 4 / 5,
    '16:9': 16 / 9,
    '9:16': 9 / 16,
    '3:4': 3 / 4,
    '4:3': 4 / 3,
    'auto': 1
  };
  const ratioValue = ratioMap[aspectRatio] || 1;
  const count = images.length;

  // Dynamic Grid Computation Engine (Supports 1-50+ images)
  let gridStyle: React.CSSProperties = {
    gap: `${spacing}px`,
    gridAutoRows: '1fr',
  };

  if (layout === 'grid') {
    const cols = count === 1 ? 1 : Math.ceil(Math.sqrt(count));
    gridStyle.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  } else if (layout === 'split-h') {
    gridStyle.gridTemplateColumns = `repeat(1, minmax(0, 1fr))`;
  } else if (layout === 'split-v') {
    gridStyle.gridTemplateColumns = `repeat(2, minmax(0, 1fr))`;
  } else if (layout === 'asymmetric') {
    gridStyle.gridTemplateColumns = count === 1 ? `repeat(1, minmax(0, 1fr))` : `repeat(3, minmax(0, 1fr))`;
    gridStyle.gridAutoFlow = 'dense';
  } else if (layout === 'masonry') {
    const cols = count <= 2 ? count : Math.max(3, Math.ceil(Math.sqrt(count)));
    gridStyle.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    gridStyle.gridAutoFlow = 'dense';
  }

  return (
    <div 
      className="relative flex items-center justify-center w-full h-full min-h-0 min-w-0"
      onClick={() => useEditorStore.getState().setSelectedImage(null)}
    >
      <div 
        className="relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out"
        id="collage-canvas"
        style={{ 
          backgroundColor, 
          padding: `${spacing}px`,
          aspectRatio: aspectMap[aspectRatio] || '1',
          width: '100%',
          maxWidth: `calc(75vh * ${ratioValue})`,
          maxHeight: '75vh'
        }}
      >
        <div 
          className="w-full h-full grid relative"
          style={gridStyle}
        >
        <AnimatePresence mode="popLayout">
          {images.map((img, i) => {
            const isSelected = img.id === useEditorStore.getState().selectedImageId;
            
            // Asymmetric (Layout 4) & Masonry (Layout 5) Organic Span Engine
            let spanStyle: React.CSSProperties = { borderRadius: `${borderRadius}px` };
            
            if (layout === 'asymmetric' && count > 1) {
              if (i === 0) {
                 spanStyle = { ...spanStyle, gridColumn: 'span 2', gridRow: 'span 2' };
              } else if (i % 5 === 4) {
                 spanStyle = { ...spanStyle, gridColumn: 'span 2' };
              }
            } else if (layout === 'masonry') {
              if (i % 7 === 0 && count > 4) {
                 spanStyle = { ...spanStyle, gridRow: 'span 2', gridColumn: 'span 2' };
              } else if (i % 3 === 0) {
                 spanStyle = { ...spanStyle, gridRow: 'span 2' };
              } else if (i % 5 === 0) {
                 spanStyle = { ...spanStyle, gridColumn: 'span 2' };
              }
            }

            return (
              <motion.div
                layout="position"
                layoutId={`mask-${img.id}`} // Persistent mask layoutId
                key={`mask-${img.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  layout: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.3 } 
                }}
                className={`relative overflow-hidden bg-black/20 select-none transition-all duration-300 ease-out ${
                  isSelected 
                    ? 'ring-[2px] ring-primary/80 ring-offset-2 ring-offset-black z-20 shadow-[0_0_30px_rgba(59,130,246,0.25)] scale-[1.01]' 
                    : 'z-0 hover:ring-1 hover:ring-white/20'
                }`}
                style={spanStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  useEditorStore.getState().setSelectedImage(img.id);
                }}
              >
                {/* 
                  The DraggableImage is injected inside the mask. 
                  Because the mask scales and moves via FLIP, the image inside retains its transform.
                */}
                <DraggableImage image={img} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
