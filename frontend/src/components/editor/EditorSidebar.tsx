"use client";

import { useEditorStore, LayoutType, AspectRatio } from "@/store/useEditorStore";
import { Grid2X2, AlignHorizontalSpaceAround, Columns, Rows, Grid3X3, Image as ImageIcon, Plus, Settings2, SlidersHorizontal, Square, Check, X, Maximize, Frame, Palette, Box, CornerUpLeft, LayoutGrid } from "lucide-react";
import clsx from "clsx";
import * as Popover from '@radix-ui/react-popover';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export function EditorSidebar() {
  const { 
    collageMode, setCollageMode,
    layout, setLayout, 
    spacing, setSpacing, 
    borderRadius, setBorderRadius,
    aspectRatio, setAspectRatio,
    backgroundColor, setBackgroundColor,
    images, selectedImageId,
    addImage, removeImage, updateImage, setSelectedImage
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios: { id: AspectRatio; label: string; icon: any }[] = [
    { id: '1:1', label: 'Square', icon: Square },
    { id: '3:4', label: 'Portrait', icon: Frame },
    { id: '4:3', label: 'Post', icon: Frame },
    { id: '9:16', label: 'Story', icon: Frame },
    { id: '16:9', label: 'Wide', icon: Frame },
  ];

  return (
    <div className="flex flex-col h-full bg-black/20 text-white p-4 gap-6 overflow-y-auto custom-scrollbar">
      
      <AnimatePresence mode="popLayout">
        {selectedImageId ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            {/* Image Editing Mode */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-sm font-semibold tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" /> Image Edits
              </h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {(() => {
              const selectedImg = images.find(img => img.id === selectedImageId);
              if (!selectedImg) return null;
              return (
                <div className="flex flex-col gap-6">
                  {/* Zoom Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <label className="font-medium text-muted-foreground">Zoom Level</label>
                      <span className="text-white bg-white/10 px-2 py-0.5 rounded text-xs">{Math.round(selectedImg.scale * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="5" step="0.1"
                      value={selectedImg.scale}
                      onChange={(e) => updateImage(selectedImageId, { scale: Number(e.target.value) })}
                      className="w-full accent-primary h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Reset Button */}
                  <button 
                    onClick={() => updateImage(selectedImageId, { panX: 0, panY: 0, scale: 1 })}
                    className="w-full py-2.5 mt-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors flex justify-center items-center gap-2"
                  >
                    <Maximize className="w-4 h-4" /> Reset Fit
                  </button>
                </div>
              );
            })()}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            {/* Photos Section */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Photos</h3>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{images.length}/50</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div key={img.id} className="aspect-square rounded-xl bg-white/5 border border-white/10 overflow-hidden relative group cursor-pointer" onClick={() => setSelectedImage(img.id)}>
                    <img src={img.url} alt="Layer" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                      className="absolute top-1 right-1 bg-black/50 backdrop-blur p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                
                {images.length < 50 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 flex items-center justify-center transition-colors group"
                  >
                    <Plus className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors group-hover:scale-110 duration-300" />
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files || []).forEach(file => addImage(file));
                    e.target.value = '';
                  }}
                />
              </div>
            </section>

            {/* Settings Cards Section */}
            <section className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Canvas Style</h3>
              <div className="grid grid-cols-2 gap-2">
                
                {/* Aspect Ratio Popover */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors h-24">
                      <Frame className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs font-medium text-white">Aspect</span>
                      <span className="text-[10px] text-primary bg-primary/10 px-1.5 rounded">{aspectRatio}</span>
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="z-50 w-64 bg-[#18181b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95" sideOffset={8}>
                      <h4 className="text-sm font-semibold text-white mb-3">Aspect Ratio</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {aspectRatios.map(ar => {
                          const Icon = ar.icon;
                          return (
                            <button
                              key={ar.id}
                              onClick={() => setAspectRatio(ar.id)}
                              className={clsx(
                                "flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors border",
                                aspectRatio === ar.id ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white"
                              )}
                            >
                              <Icon className="w-4 h-4" /> {ar.label}
                            </button>
                          )
                        })}
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                {/* Color Popover */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors h-24">
                      <Palette className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs font-medium text-white">Color</span>
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor }} />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="z-50 w-64 bg-[#18181b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl outline-none" sideOffset={8}>
                      <h4 className="text-sm font-semibold text-white mb-3">Background Color</h4>
                      <div className="flex gap-3 mb-4">
                        <input 
                          type="color" 
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 p-0 overflow-hidden shrink-0 bg-transparent"
                        />
                        <input 
                          type="text" 
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 text-sm focus:outline-none uppercase text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        {['#18181b', '#ffffff', '#000000', '#3b82f6', '#ef4444'].map(c => (
                          <button 
                            key={c}
                            onClick={() => setBackgroundColor(c)}
                            className={clsx("w-6 h-6 rounded-full border", backgroundColor === c ? "border-primary" : "border-white/20")}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                {/* Space Popover */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors h-24">
                      <LayoutGrid className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs font-medium text-white">Space</span>
                      <span className="text-[10px] text-muted-foreground">{spacing}px</span>
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="z-50 w-64 bg-[#18181b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl outline-none" sideOffset={8}>
                      <h4 className="text-sm font-semibold text-white mb-4">Grid Spacing</h4>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Gap Size</span>
                          <span className="text-white">{spacing}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="64" 
                          value={spacing}
                          onChange={(e) => setSpacing(Number(e.target.value))}
                          className="w-full accent-primary h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        {[0, 8, 16, 32].map(s => (
                          <button 
                            key={s} onClick={() => setSpacing(s)}
                            className={clsx("flex-1 py-1 rounded text-xs border transition-colors", spacing === s ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white")}
                          >
                            {s === 0 ? 'None' : s}
                          </button>
                        ))}
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                {/* Corner Popover */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors h-24">
                      <Box className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs font-medium text-white">Corner</span>
                      <span className="text-[10px] text-muted-foreground">{borderRadius}px</span>
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="z-50 w-64 bg-[#18181b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl outline-none" sideOffset={8}>
                      <h4 className="text-sm font-semibold text-white mb-4">Corner Radius</h4>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Radius Size</span>
                          <span className="text-white">{borderRadius}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="64" 
                          value={borderRadius}
                          onChange={(e) => setBorderRadius(Number(e.target.value))}
                          className="w-full accent-primary h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        {[0, 12, 24, 48].map(r => (
                          <button 
                            key={r} onClick={() => setBorderRadius(r)}
                            className={clsx("flex-1 py-1 rounded text-xs border transition-colors", borderRadius === r ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white")}
                          >
                            {r === 0 ? 'Square' : r}
                          </button>
                        ))}
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
