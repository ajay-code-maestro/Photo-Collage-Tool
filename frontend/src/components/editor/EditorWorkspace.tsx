"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useEditorStore } from "@/store/useEditorStore";
import { UploadCloud } from "lucide-react";
import { CollageGrid } from "./CollageGrid";
import { motion, AnimatePresence } from "framer-motion";
import { loadFaceDetectionModels, detectFocalPoint } from "@/lib/faceDetection";

export function EditorWorkspace() {
  const { images, addImage, layout, setLayout } = useEditorStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Fire and forget load of models
    loadFaceDetectionModels();

    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        // First add the image and wait for its ID to be generated
        const newId = await addImage(file);
        if (!newId) continue;
        
        // Then async detect faces using the base64 URL from the state
        const state = useEditorStore.getState();
        const addedImg = state.images.find(img => img.id === newId);
        if (addedImg) {
          const img = new Image();
          img.src = addedImg.url;
          img.onload = async () => {
             const focalPoint = await detectFocalPoint(img);
             if (focalPoint) {
                useEditorStore.getState().updateImage(newId, { focalPoint });
             }
          };
        }
      }
    }
  }, [addImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    noClick: images.length > 0 // Only allow clicking to upload if empty
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative w-full max-w-4xl max-h-full flex items-center justify-center transition-all duration-300
        ${isDragActive ? 'scale-105 ring-4 ring-primary ring-opacity-50 rounded-3xl' : ''}`}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {images.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center p-12 text-center w-full aspect-video max-w-2xl border-2 border-dashed border-white/20 rounded-[2rem] bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Upload Photos</h3>
            <p className="text-muted-foreground max-w-md">
              Drag and drop your images here, or click to browse. Support for JPG, PNG, WEBP, and HEIC.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col items-center justify-center p-4 relative"
          >
            <CollageGrid />

            {/* Floating Layout Toolbar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 z-40"
            >
              <div className="flex items-center gap-1 p-2 bg-[#18181b]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                {[
                  { id: 'grid', icon: require('lucide-react').Grid2X2, label: 'Grid' },
                  { id: 'masonry', icon: require('lucide-react').AlignHorizontalSpaceAround, label: 'Masonry' },
                  { id: 'split-h', icon: require('lucide-react').Rows, label: 'Split H' },
                  { id: 'split-v', icon: require('lucide-react').Columns, label: 'Split V' },
                  { id: 'asymmetric', icon: require('lucide-react').Grid3X3, label: 'Dynamic' },
                ].map(l => {
                  const Icon = l.icon;
                  const isActive = layout === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLayout(l.id as any)}
                      className={`relative p-3 rounded-xl transition-colors ${isActive ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                      title={l.label}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeLayout"
                          className="absolute inset-0 bg-primary/20 border border-primary/50 rounded-xl"
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                      )}
                      <Icon className="w-5 h-5 relative z-10" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag overlay when dragging over existing collage */}
      <AnimatePresence>
        {isDragActive && images.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50 border-2 border-primary border-dashed"
          >
            <div className="bg-card px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-xl">
              <UploadCloud className="w-5 h-5" /> Drop to add
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
