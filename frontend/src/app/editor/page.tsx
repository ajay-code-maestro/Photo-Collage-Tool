"use client";

import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { EditorWorkspace } from "@/components/editor/EditorWorkspace";
import { useEditorStore } from "@/store/useEditorStore";
import { Sparkles, Layout, Undo2, Redo2, Download } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import * as htmlToImage from 'html-to-image';
import { AuthModal } from "@/components/AuthModal";

import { ExportModal, ExportOptions } from "@/components/editor/ExportModal";

export default function EditorPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({ isOpen: false, mode: 'login' });
  
  const { isProcessingAI, setProcessingAI, images, setLayout } = useEditorStore();
  const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('gridai_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    
    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('gridai_token');
    localStorage.removeItem('gridai_user');
    window.dispatchEvent(new Event('auth-change'));
  };

  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true);
    try {
      // Small delay to allow any modal close animations to start before heavy rendering blocks main thread
      await new Promise(r => setTimeout(r, 100));
      
      const node = document.getElementById('collage-canvas');
      if (!node) return;
      
      const canvas = await htmlToImage.toCanvas(node, { 
        pixelRatio: options.resolution, // 1x, 2x, 3x
      });
      
      let mimeType = 'image/png';
      if (options.format === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (options.format === 'webp') {
        mimeType = 'image/webp';
      }

      const dataUrl = canvas.toDataURL(mimeType, options.quality);
      
      const link = document.createElement('a');
      link.download = `${options.filename}.${options.format}`;
      link.href = dataUrl;
      link.click();
      setExportModalOpen(false);
    } catch (err) {
      console.error('Failed to export', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAILayout = async () => {
    if (images.length === 0) return;
    setProcessingAI(true);
    try {
      // Simulate backend API call delay for cinematic effect
      await new Promise(r => setTimeout(r, 1500));
      
      let portraitCount = 0;
      let landscapeCount = 0;
      images.forEach(img => {
        portraitCount++; 
      });

      let recommendedLayout: any = 'grid';
      if (images.length === 2) recommendedLayout = 'split-v';
      else if (images.length >= 3) recommendedLayout = 'masonry';
      
      setLayout(recommendedLayout);
    } finally {
      setProcessingAI(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        initialMode={authModal.mode} 
      />
      <ExportModal 
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {/* Editor Header */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 shrink-0 glass z-40">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">Photo Collage Tool</span>
          </Link>
          
          {/* Undo / Redo */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-6">
            <button 
              onClick={() => undo()} 
              disabled={pastStates.length === 0}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => redo()} 
              disabled={futureStates.length === 0}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 mr-2 border-r border-white/10 pr-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                  className="px-3 py-1.5 text-sm font-medium rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          <button 
            onClick={handleAILayout}
            disabled={isProcessingAI || images.length === 0}
            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessingAI ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
            AI Auto-Layout
          </button>
          <button 
            onClick={() => setExportModalOpen(true)}
            disabled={images.length === 0}
            className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Floating Left Sidebar */}
        <aside className="absolute left-6 top-6 bottom-6 w-[340px] flex flex-col glass rounded-2xl border border-white/10 shrink-0 z-30 shadow-2xl overflow-hidden backdrop-blur-3xl bg-black/40">
          <EditorSidebar />
        </aside>

        {/* Workspace (Canvas area) */}
        <div className="flex-1 relative bg-[#050505] overflow-auto flex items-center justify-center pl-[380px] p-8">
          {/* Ambient Cinematic Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_60%)] pointer-events-none" />
          
          <EditorWorkspace />

          {/* AI Processing Overlay */}
          {isProcessingAI && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-500">
               <div className="text-primary animate-pulse flex flex-col items-center gap-4">
                 <Sparkles className="w-12 h-12" />
                 <span className="font-semibold tracking-wider uppercase text-sm">Analyzing Composition...</span>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
