"use client";

import { motion } from "framer-motion";
import { ArrowRight, Image as ImageIcon, Layout, Sparkles, Wand2, Upload, MonitorSmartphone, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });

  const features = [
    {
      icon: <Wand2 className="w-6 h-6 text-primary" />,
      title: "Smart AI Layouts",
      description: "Our AI instantly analyzes your photos and suggests perfect grid combinations based on colors and composition.",
    },
    {
      icon: <Layout className="w-6 h-6 text-purple-400" />,
      title: "Dynamic Grids",
      description: "From 1 to 10+ images, masonry to Instagram carousel, find the perfect layout without distortion.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-pink-400" />,
      title: "Premium Aesthetics",
      description: "Add glassmorphism borders, neon shadows, and smooth gradients to make your collages stand out.",
    },
    {
      icon: <MonitorSmartphone className="w-6 h-6 text-emerald-400" />,
      title: "Export Anywhere",
      description: "Download high-res PNGs or WEBPs formatted instantly for Story, Reel, or Post sizes.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass border-b-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <Layout className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Photo Collage Tool</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <button 
            onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </button>
          <button 
            onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            Sign up
          </button>
        </nav>
        <Link href="/editor" className="ml-4 px-5 py-2 rounded-full bg-foreground text-background font-medium text-sm hover:scale-105 transition-transform">
          Open Editor
        </Link>
      </header>

      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        initialMode={authModal.mode} 
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-muted-foreground">Introducing Photo Collage Tool 2.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl leading-tight"
        >
          The smartest way to build <span className="text-gradient">stunning collages.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
        >
          Drop your photos, let our AI suggest the perfect layout, and export high-res masterpieces in seconds. Built for creators.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <Link href="/editor" className="px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-medium text-lg flex items-center gap-2 transition-all hover:gap-3 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            Start Creating <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Large Demo Visual */}
      <section className="px-6 pb-32 max-w-7xl mx-auto w-full" id="demo">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden glass-card p-2 border border-white/10"
        >
          {/* Abstract representation of the editor interface */}
          <div className="absolute inset-0 bg-card/80 rounded-[22px] flex flex-col overflow-hidden">
             {/* Fake Topbar */}
             <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
             </div>
             {/* Fake Editor Space */}
             <div className="flex-1 flex p-6 gap-6">
                <div className="w-64 hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
                  <div className="h-8 w-1/2 bg-white/5 rounded-md" />
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/10" />
                    ))}
                  </div>
                </div>
                <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden group">
                  {/* Fake Collage Grid inside demo */}
                  <div className="w-[80%] h-[80%] grid grid-cols-2 gap-2 p-2 bg-white/5 rounded-xl rotate-1 group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg opacity-80" />
                    <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg opacity-80" />
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg opacity-80 col-span-2" />
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                     <div className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium flex items-center gap-2">
                       <Upload className="w-4 h-4" /> Try it live
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full relative" id="features">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">More than just grids.</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to craft the perfect visual story, powered by advanced layout algorithms.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onMouseEnter={() => setHoveredFeature(idx)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="p-6 rounded-3xl glass-card relative overflow-hidden group cursor-default"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to create?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">Join thousands of creators building stunning collages in seconds. No signup required to start.</p>
          <Link href="/editor" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-lg hover:scale-105 transition-transform">
            Launch Editor <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" />
            <span className="font-bold">Photo Collage Tool</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Photo Collage Tool. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
