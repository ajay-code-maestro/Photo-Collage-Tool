"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Image as ImageIcon, Settings, FileImage } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export type ExportFormat = 'png' | 'jpeg' | 'webp';
export type ExportResolution = 1 | 2 | 3; // 1x, 2x, 3x

export interface ExportOptions {
  format: ExportFormat;
  resolution: ExportResolution;
  quality: number;
  filename: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  isExporting: boolean;
}

export function ExportModal({ isOpen, onClose, onExport, isExporting }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [resolution, setResolution] = useState<ExportResolution>(2);
  const [quality, setQuality] = useState<number>(0.9);
  const [filename, setFilename] = useState('gridai-collage');

  const handleExport = () => {
    onExport({ format, resolution, quality, filename });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-6"
          >
            <div className="bg-[#18181b]/90 backdrop-blur-2xl rounded-[2rem] p-8 relative overflow-hidden border border-white/10 shadow-2xl">
              <button 
                onClick={onClose}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Export Collage</h2>
                  <p className="text-sm text-muted-foreground">Customize your final render</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                
                {/* Filename Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileImage className="w-4 h-4" /> Filename
                  </label>
                  <input 
                    type="text" 
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary transition-colors text-sm"
                    placeholder="My Awesome Collage"
                  />
                </div>

                {/* Format Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['png', 'jpeg', 'webp'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f as ExportFormat)}
                        className={clsx(
                          "py-2 rounded-lg text-sm font-medium uppercase transition-colors border",
                          format === f 
                            ? "bg-primary/20 border-primary text-primary" 
                            : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Resolution
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 1, label: 'Standard' },
                      { val: 2, label: 'HD' },
                      { val: 3, label: 'Ultra HD' }
                    ].map((r) => (
                      <button
                        key={r.val}
                        onClick={() => setResolution(r.val as ExportResolution)}
                        className={clsx(
                          "py-2 flex flex-col items-center justify-center rounded-lg text-sm transition-colors border",
                          resolution === r.val 
                            ? "bg-primary/20 border-primary text-primary" 
                            : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <span className="font-semibold">{r.label}</span>
                        <span className="text-[10px] opacity-70">{r.val}x Scale</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider (only for JPEG/WEBP) */}
                <AnimatePresence>
                  {(format === 'jpeg' || format === 'webp') && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <div className="flex justify-between items-center text-sm">
                        <label className="font-medium text-muted-foreground">Quality</label>
                        <span className="text-white bg-white/10 px-2 py-0.5 rounded text-xs">
                          {Math.round(quality * 100)}%
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" max="1" step="0.1"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Button */}
                <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold mt-4 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isExporting ? (
                    <span className="animate-pulse">Rendering...</span>
                  ) : (
                    <>Generate File <Download className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
