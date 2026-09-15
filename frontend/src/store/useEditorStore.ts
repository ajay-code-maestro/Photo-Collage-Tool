import { create } from 'zustand';
import { temporal } from 'zundo';

export type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16' | '3:4' | '4:3' | 'auto';
export type LayoutType = 'grid' | 'masonry' | 'split-h' | 'split-v' | 'asymmetric';

export interface EditorImage {
  id: string;
  url: string;
  file: File;
  panX: number;
  panY: number;
  scale: number;
  rotation: number;
  focalPoint?: { x: number, y: number }; // Used by AI face detection
}

interface EditorState {
  images: EditorImage[];
  layout: LayoutType;
  spacing: number; // 0 to 100
  borderRadius: number; // 0 to 100
  aspectRatio: AspectRatio;
  backgroundColor: string;
  isProcessingAI: boolean;
  collageMode: 'single' | 'carousel';
  selectedImageId: string | null;
  
  // Actions
  setCollageMode: (mode: 'single' | 'carousel') => void;
  addImage: (file: File) => Promise<string | undefined>;
  removeImage: (id: string) => void;
  updateImage: (id: string, updates: Partial<EditorImage>) => void;
  setLayout: (layout: LayoutType) => void;
  setSpacing: (spacing: number) => void;
  setBorderRadius: (radius: number) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setBackgroundColor: (color: string) => void;
  setProcessingAI: (isProcessing: boolean) => void;
  setSelectedImage: (id: string | null) => void;
  clearImages: () => void;
}

export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      images: [],
      layout: 'grid',
      spacing: 8,
      borderRadius: 0,
      aspectRatio: '1:1',
      backgroundColor: '#18181b', // matches --color-card
      isProcessingAI: false,
      collageMode: 'single',
      selectedImageId: null,

      setCollageMode: (collageMode) => set({ collageMode }),

      addImage: async (file) => {
        const state = useEditorStore.getState();
        if (state.images.length >= 50) return undefined;

        try {
          const base64Url = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          });

          const newId = Math.random().toString(36).substring(7);

          set((state) => {
            if (state.images.length >= 50) return state;
            const newImage: EditorImage = {
              id: newId,
              url: base64Url,
              file,
              panX: 0,
              panY: 0,
              scale: 1,
              rotation: 0
            };
            return { images: [...state.images, newImage] };
          });

          return newId;
        } catch (error) {
          console.error("Failed to convert file to base64", error);
          return undefined;
        }
      },
      
      removeImage: (id) => set((state) => ({
        images: state.images.filter(img => img.id !== id)
      })),

      updateImage: (id, updates) => set((state) => ({
        images: state.images.map(img => 
          img.id === id ? { ...img, ...updates } : img
        )
      })),

      setLayout: (layout) => set({ layout }),
      setSpacing: (spacing) => set({ spacing }),
      setBorderRadius: (borderRadius) => set({ borderRadius }),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      setProcessingAI: (isProcessingAI) => set({ isProcessingAI }),
      setSelectedImage: (id) => set({ selectedImageId: id }),
      clearImages: () => set({ images: [], selectedImageId: null }),
    }),
    {
      partialize: (state) => {
        // We only want to undo/redo these fields, not isProcessingAI or files
        const { images, layout, spacing, borderRadius, aspectRatio, backgroundColor } = state;
        return { images, layout, spacing, borderRadius, aspectRatio, backgroundColor };
      },
    }
  )
);
