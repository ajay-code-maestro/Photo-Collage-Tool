"use client";

import { useGesture } from '@use-gesture/react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEditorStore, EditorImage } from '@/store/useEditorStore';
import { useRef, useEffect } from 'react';

interface DraggableImageProps {
  image: EditorImage;
}

export function DraggableImage({ image }: DraggableImageProps) {
  const { updateImage } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Springs for smooth inertia
  const x = useSpring(image.panX, { stiffness: 400, damping: 40 });
  const y = useSpring(image.panY, { stiffness: 400, damping: 40 });
  const scale = useSpring(image.scale, { stiffness: 400, damping: 40 });

  const getBounds = (currentScale: number) => {
    if (!containerRef.current || !imgRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const { naturalWidth: nW, naturalHeight: nH } = imgRef.current;
    if (!nW || !nH) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    
    const { clientWidth: cW, clientHeight: cH } = containerRef.current;
    const coverScale = Math.max(cW / nW, cH / nH);
    const iW = nW * coverScale;
    const iH = nH * coverScale;
    
    const maxScreenX = Math.max(0, (iW * currentScale - cW) / 2);
    const maxScreenY = Math.max(0, (iH * currentScale - cH) / 2);
    
    return { minX: -maxScreenX, maxX: maxScreenX, minY: -maxScreenY, maxY: maxScreenY };
  };

  const clampPosition = (currentScale: number) => {
    const b = getBounds(currentScale);
    const clampedX = Math.max(b.minX, Math.min(b.maxX, x.get()));
    const clampedY = Math.max(b.minY, Math.min(b.maxY, y.get()));
    if (clampedX !== x.get() || clampedY !== y.get()) {
      x.set(clampedX);
      y.set(clampedY);
      return { clampedX, clampedY };
    }
    return null;
  };

  // Sync springs if store changes (e.g. via undo/redo or sidebar zoom)
  useEffect(() => {
    scale.set(image.scale);
    
    // If the store updated pan directly (e.g. reset), sync it
    if (Math.abs(x.get() - image.panX) > 1) x.set(image.panX);
    if (Math.abs(y.get() - image.panY) > 1) y.set(image.panY);
    
    // Clamp based on new scale
    const clamped = clampPosition(image.scale);
    if (clamped) {
      updateImage(image.id, { panX: clamped.clampedX, panY: clamped.clampedY });
    }
  }, [image.panX, image.panY, image.scale]);

  // Re-clamp on resize (aspect ratio changes)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      const clamped = clampPosition(scale.get());
      if (clamped) {
        updateImage(image.id, { panX: clamped.clampedX, panY: clamped.clampedY });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [image.id, updateImage]);

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        x.set(dx);
        y.set(dy);
      },
      onDragEnd: ({ offset: [dx, dy] }) => {
        updateImage(image.id, { panX: x.get(), panY: y.get() });
      },
      onPinch: ({ offset: [s] }) => {
        const newScale = Math.max(1, Math.min(s, 5)); // Min scale 1 ensures no gaps
        scale.set(newScale);
        clampPosition(newScale);
      },
      onPinchEnd: ({ offset: [s] }) => {
        const newScale = Math.max(1, Math.min(s, 5));
        const clamped = clampPosition(newScale);
        updateImage(image.id, { 
          scale: newScale,
          panX: clamped ? clamped.clampedX : x.get(),
          panY: clamped ? clamped.clampedY : y.get()
        });
      },
      onWheel: ({ event, delta: [, dy] }) => {
        if (event.ctrlKey) {
           event.preventDefault();
           const currentScale = scale.get();
           const newScale = Math.max(1, Math.min(currentScale - dy * 0.01, 5));
           scale.set(newScale);
           const clamped = clampPosition(newScale);
           updateImage(image.id, { 
             scale: newScale,
             panX: clamped ? clamped.clampedX : x.get(),
             panY: clamped ? clamped.clampedY : y.get()
           });
        }
      }
    },
    {
      target: containerRef,
      drag: {
        from: () => [x.get(), y.get()],
        bounds: () => {
           const b = getBounds(scale.get());
           return { left: b.minX, right: b.maxX, top: b.minY, bottom: b.maxY };
        },
        rubberband: true,
        pointer: { keys: false }
      },
      pinch: {
        from: () => [scale.get(), 0],
        scaleBounds: { min: 1, max: 5 },
        modifierKey: 'ctrlKey'
      },
      eventOptions: { passive: false }
    }
  );

  const objectPosition = useTransform(
    [x, y, scale],
    ([latestX, latestY, latestZ]: any[]) => `calc(50% + ${(latestX as number) / (latestZ as number)}px) calc(50% + ${(latestY as number) / (latestZ as number)}px)`
  );

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden touch-none cursor-move select-none"
    >
      <motion.img
        ref={imgRef}
        src={image.url}
        alt="collage-layer"
        onLoad={() => clampPosition(scale.get())}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          scale,
        }}
        className="pointer-events-none"
      />
    </div>
  );
}
