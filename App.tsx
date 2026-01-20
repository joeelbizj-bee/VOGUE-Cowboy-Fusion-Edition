
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Button from './components/Button';
import { transformImageToCowboy } from './services/geminiService';
import { TransformationState, ViewMode } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<TransformationState>({
    originalImage: null,
    editedImage: null,
    isProcessing: false,
    error: null,
  });

  const [view, setView] = useState<ViewMode>(ViewMode.UPLOAD);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, originalImage: reader.result as string, error: null }));
        setView(ViewMode.PREVIEW);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransform = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      const result = await transformImageToCowboy(state.originalImage);
      setState(prev => ({ ...prev, editedImage: result, isProcessing: false }));
      setView(ViewMode.RESULT);
    } catch (err: any) {
      setState(prev => ({ ...prev, isProcessing: false, error: err.message }));
    }
  };

  const reset = () => {
    setState({
      originalImage: null,
      editedImage: null,
      isProcessing: false,
      error: null,
    });
    setView(ViewMode.UPLOAD);
  };

  const renderContent = () => {
    switch (view) {
      case ViewMode.UPLOAD:
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-700">
            <div className="max-w-md w-full p-12 border border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <div className="mb-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="vogue-font text-2xl mb-2">Editor's Selection</h2>
                <p className="text-white/40 text-sm italic">Upload a portrait to begin the transformation.</p>
              </div>
              
              <label className="cursor-pointer group">
                <div className="hidden">
                  <input type="file" accept="image/*" onChange={handleFileUpload} />
                </div>
                <div className="px-8 py-4 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors">
                  Select Photograph
                </div>
              </label>
            </div>
          </div>
        );

      case ViewMode.PREVIEW:
        return (
          <div className="max-w-4xl mx-auto p-4 animate-in slide-in-from-bottom-10 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative group overflow-hidden border border-white/10">
                  <img src={state.originalImage!} alt="Original" className="w-full h-auto" />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 text-[10px] tracking-widest uppercase text-white border border-white/20">
                    Before
                  </div>
                </div>
                <div className="space-y-6">
                  <h2 className="vogue-font text-3xl md:text-4xl italic leading-tight">
                    "Style is a way to say who you are without having to speak."
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed font-light">
                    Our generative AI will reimagining your outfit with a tailored jacket, fitted trousers, and the iconic cowboy kofia fusion, while preserving every unique detail of your face.
                  </p>
                  
                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleTransform} disabled={state.isProcessing} className="w-full sm:w-auto">
                      {state.isProcessing ? 'Generating Look...' : 'Apply Fashion Edit'}
                    </Button>
                    <Button variant="outline" onClick={reset} disabled={state.isProcessing} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                  </div>

                  {state.error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 text-xs tracking-wide uppercase">
                      Error: {state.error}
                    </div>
                  )}

                  {state.isProcessing && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] tracking-widest uppercase text-white/40">
                        <span>Developing Film...</span>
                        <span>AI Render</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-white animate-shimmer" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
        );

      case ViewMode.RESULT:
        return (
          <div className="max-w-6xl mx-auto px-4 pb-12 animate-in fade-in duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8">
                <div className="relative border-8 border-white p-2 md:p-4 bg-white shadow-2xl">
                  <img src={state.editedImage!} alt="Edited Look" className="w-full h-auto grayscale-0 hover:grayscale transition-all duration-700 cursor-crosshair" />
                  <div className="absolute bottom-8 right-8 text-black/20 font-serif italic text-4xl pointer-events-none select-none">
                    Issue No. 001
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4 space-y-8 flex flex-col justify-center h-full">
                <div className="border-l border-white/20 pl-6 py-2">
                  <h3 className="vogue-font text-4xl mb-4 italic">The Cowboy Kofia</h3>
                  <p className="text-white/60 text-sm font-light leading-relaxed">
                    A masterclass in cross-cultural tailoring. This look pairs the structured silhouette of a classic tailored jacket with the rebellious spirit of the frontier.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <a 
                    href={state.editedImage!} 
                    download="vogue-cowboy-look.png"
                    className="w-full"
                  >
                    <Button className="w-full">Download Masterpiece</Button>
                  </a>
                  <Button variant="outline" onClick={reset} className="w-full">Create New Look</Button>
                </div>

                <div className="pt-8 opacity-30">
                  <h4 className="text-[10px] tracking-[0.5em] uppercase mb-4">Photography By AI</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <img src={state.originalImage!} className="w-full h-16 object-cover grayscale" alt="Reference" />
                    <div className="w-full h-16 bg-white/5 flex items-center justify-center text-[8px] border border-white/10 uppercase tracking-widest px-2 text-center">
                      Reference Plate 01
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      <main className="container mx-auto px-4">
        {renderContent()}
      </main>
      
      <footer className="mt-24 border-t border-white/5 py-12 text-center">
        <p className="text-[10px] tracking-[0.5em] uppercase text-white/20">
          © 2024 VOGUE Generative Studios | All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default App;
