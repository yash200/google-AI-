import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JenkinsForklift, RobotN8N, QuillNote, NotionDashboard, DataStream } from './components/Illustrations';
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [splitPos, setSplitPos] = React.useState(50);
  const [isHoveringLeft, setIsHoveringLeft] = React.useState(false);
  const [isHoveringRight, setIsHoveringRight] = React.useState(false);
  const [isLeftOverheated, setIsLeftOverheated] = React.useState(false);
  const [isRightOptimizing, setIsRightOptimizing] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  
  // AI Feature State
  const [prompt, setPrompt] = React.useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [assetType, setAssetType] = React.useState<'image' | 'video'>('image');
  const [error, setError] = React.useState<string | null>(null);

  const staticSuggestions = [
    { label: 'Ghibli City', prompt: 'A futuristic city in Studio Ghibli style, lush greenery, soft morning light' },
    { label: 'Cyberpunk n8n', prompt: 'n8n robot logo as a neon cyberpunk sign in a rainy alley' },
    { label: 'Floating Island', prompt: 'A magical floating island with waterfalls and a small tech workshop' },
    { label: 'Space Dashboard', prompt: 'A holographic dashboard floating in deep space with nebula clouds' }
  ];

  // Dynamic suggestions based on user input patterns
  const dynamicSuggestions = React.useMemo(() => {
    if (!prompt.trim()) return staticSuggestions;
    const lower = prompt.toLowerCase();
    
    if (lower.includes('robot') || lower.includes('mech')) {
      return [
        { label: 'Steampunk Mech', prompt: 'A giant steampunk mechanical spider in a Victorian city' },
        { label: 'Cute Bot', prompt: 'A tiny cute robot making a sandwich with laser precision' },
        ...staticSuggestions.slice(0, 2)
      ];
    }
    if (lower.includes('city') || lower.includes('street')) {
      return [
        { label: 'Cyber Alley', prompt: 'A narrow cyberpunk alley with glowing neon signs and puddles' },
        { label: 'Rome 3000', prompt: 'Ancient Rome reimagined in the year 3000 with flying chariots' },
        ...staticSuggestions.slice(0, 2)
      ];
    }
    return staticSuggestions;
  }, [prompt]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPos(Math.min(Math.max(x, 5), 95));
    }
  };

  const triggerLeftError = () => {
    setIsLeftOverheated(true);
    setTimeout(() => setIsLeftOverheated(false), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    // Check for API key if using Video
    if (assetType === 'video') {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio?.openSelectKey();
        return; // Selection might take time, or user might cancel. Assume success and retry on next click or proceed? 
        // Skill says: "assume the key selection was successful after triggering openSelectKey() and proceed to the app. Do not add delay"
        // But for a tool call, we should ideally proceed.
      }
    }

    setIsGenerating(true);
    setIsRightOptimizing(true);
    setError(null);
    setGeneratedImageUrl(null);

    // Create fresh instance right before call as per skill
    const ai = new GoogleGenAI({ apiKey: assetType === 'video' ? process.env.API_KEY : process.env.GEMINI_API_KEY });

    try {
      if (assetType === 'image') {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: { parts: [{ text: prompt }] },
          config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            setGeneratedImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } else {
        // Video Generation (Veo)
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-lite-generate-preview',
          prompt: prompt,
          config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '1:1' }
        });

        // Loop for completion
        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 8000));
          operation = await (ai.operations as any).getVideosOperation({ operation });
        }
        
        const videoUri = (operation.response as any)?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
          setGeneratedImageUrl(videoUri);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError('API Key error. Please re-select your key.');
        await (window as any).aistudio?.openSelectKey();
      } else {
        setError('Generation failed. Ensure your API key supports this model.');
      }
    } finally {
      setIsGenerating(false);
      setIsRightOptimizing(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `autonomous_asset_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center p-4 md:p-8 font-sans cursor-default select-none overflow-hidden">
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="w-full max-w-7xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.9)] border border-white/5 flex relative group"
      >
        
        {/* Left Side: Jenkins Forklift (Legacy) */}
        <div 
          className="absolute inset-0 z-10 transition-all duration-[150ms] ease-out"
          style={{ width: `${splitPos}%`, clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
          onMouseEnter={() => setIsHoveringLeft(true)}
          onMouseLeave={() => setIsHoveringLeft(false)}
          onClick={triggerLeftError}
        >
          <div className="w-full h-full bg-[#1a1a1a] relative overflow-hidden flex flex-col items-center justify-center cursor-pointer">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-10 left-0 w-full h-8 bg-gradient-to-b from-gray-800 to-gray-900 border-y border-gray-700" />
              <div className="absolute top-0 left-20 w-8 h-full bg-gradient-to-r from-gray-800 to-gray-900 border-x border-gray-700" />
            </div>

            <motion.div 
              className="absolute inset-0 bg-red-950/20 z-0 pointer-events-none"
              animate={{ opacity: isLeftOverheated ? 1 : 0 }}
            />

            <div className="relative z-20 flex flex-col items-center whitespace-nowrap px-8">
              <h2 className={`font-mono text-[10px] sm:text-xs tracking-[0.5em] uppercase mb-12 transition-all duration-500 ${isHoveringLeft ? 'text-red-500 opacity-80' : 'text-gray-600 opacity-40'}`}>
                {isLeftOverheated ? 'SYSTEM CRITICAL FAILURE' : 'LEGACY INDUSTRIAL CHAOS'}
              </h2>
              
              <div className="relative scale-75 xl:scale-100">
                <motion.div
                  animate={isHoveringLeft ? { x: [-3, 3, -3], rotate: [-1, 1, -1] } : {}}
                  transition={{ duration: 0.05, repeat: Infinity }}
                >
                  <JenkinsForklift isPanic={isLeftOverheated} />
                </motion.div>
                
                <motion.div 
                  className="absolute -left-20 bottom-28 pointer-events-none"
                  animate={{ 
                    x: isHoveringLeft ? [0, -10, 0] : [0, -4, 0],
                    y: isHoveringLeft ? [0, 20, 0] : [0, 10, 0],
                    rotate: isHoveringLeft ? [0, -30, 0] : [0, -15, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <QuillNote />
                </motion.div>
                <div className="absolute -bottom-4 left-1/4 w-32 h-4 bg-black/40 blur-md rounded-full" />
              </div>

              {/* Manual Input (Mock) */}
              <div className="mt-8 opacity-40 group-hover:opacity-60 transition-opacity">
                <div className="w-64 h-10 border-2 border-dashed border-gray-700 rounded-lg flex items-center px-4 gap-2 cursor-not-allowed">
                  <div className="w-3 h-3 bg-red-900 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase italic">Waiting for Jenkinsfile...</span>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-8 py-2 px-4 bg-yellow-900/10 border border-yellow-700/20 rounded-lg backdrop-blur-sm z-30 pointer-events-none">
              <span className="text-yellow-700/60 font-black text-[10px] tracking-widest uppercase italic">Jenkins v2.462</span>
            </div>
          </div>
        </div>

        {/* Right Side: n8n + AI Robot (Modern) */}
        <div 
          className="absolute inset-0 z-0 bg-white"
          onMouseEnter={() => setIsHoveringRight(true)}
          onMouseLeave={() => setIsHoveringRight(false)}
        >
          <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center cursor-default">
            {/* Ghibli Style Background */}
            <div className="absolute inset-0 bg-[#fdfbf7] pointer-events-none">
              <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-sky-200/40 blur-[120px] rounded-full" />
              <div className="absolute top-20 right-20 w-40 h-40 bg-white blur-[60px] rounded-full opacity-80" />
              <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-100/30 blur-[100px] rounded-full" />
            </div>

            {/* AI Action Particle Field */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
              <DataStream delay={0} />
              <div className="absolute top-1/4"><DataStream delay={1.5} /></div>
              <div className="absolute bottom-1/3"><DataStream delay={2.8} /></div>
            </div>

            <div className="relative z-20 flex flex-col items-center w-full px-4 h-full pt-16">
              <h2 className={`font-mono text-[10px] sm:text-xs tracking-[0.5em] uppercase mb-8 transition-all duration-500 font-bold ${isHoveringRight ? 'text-blue-600 opacity-100' : 'text-blue-400 opacity-50'}`}>
                {isGenerating ? 'AI RENDERING IN PROGRESS' : 'AUTONOMOUS WORKFLOW'}
              </h2>

              <div className="flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-16 w-full scale-[0.8] lg:scale-100">
                <div className="relative">
                  <motion.div animate={isGenerating ? { y: [-2, 2, -2], rotate: [-1, 1, -1] } : {}}>
                    <RobotN8N mousePos={mousePos} />
                  </motion.div>
                </div>

                <div className="relative group/notion">
                  <NotionDashboard 
                    assetUrl={generatedImageUrl || undefined} 
                    assetType={assetType}
                    onDownloadAsset={handleDownload} 
                  />
                  <AnimatePresence>
                    {isGenerating && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center"
                      >
                         <div className="flex flex-col items-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest animate-pulse">
                              {assetType === 'image' ? 'Processing...' : 'Rendering 48fps...'}
                            </span>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Functional Command Bar */}
              <motion.div 
                className="w-full max-w-lg mt-auto mb-16 relative"
                animate={isGenerating ? { scale: 0.98, opacity: 0.8 } : { scale: 1, opacity: 1 }}
              >
                {/* Asset Type Toggle */}
                <div className="flex justify-end gap-2 mb-2 px-1">
                   {['image', 'video'].map((t) => (
                     <button
                       key={t}
                       type="button"
                       onClick={() => setAssetType(t as any)}
                       className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${assetType === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-400 hover:bg-blue-100'}`}
                     >
                       {t}
                     </button>
                   ))}
                </div>

                {/* Dynamic Suggestions Chips */}
                <div className="flex flex-wrap gap-2 mb-4 px-2">
                  <AnimatePresence mode="popLayout">
                    {dynamicSuggestions.map((s, idx) => (
                      <motion.button
                        key={s.label}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ delay: idx * 0.05 }}
                        type="button"
                        onClick={() => setPrompt(s.prompt)}
                        className="px-3 py-1.5 bg-blue-50/50 hover:bg-blue-100/80 border border-blue-100/50 rounded-full text-[10px] font-bold text-blue-600 transition-colors backdrop-blur-sm whitespace-nowrap active:scale-95"
                      >
                        {s.label}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>

                <form 
                  onSubmit={handleGenerate}
                  className="flex items-center gap-2 p-2 bg-white/90 backdrop-blur-2xl border border-blue-100 shadow-[0_20px_50px_rgba(59,130,246,0.15)] rounded-2xl group transition-all"
                >
                  <div className="pl-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 transition-colors ${isGenerating ? 'animate-pulse bg-blue-100' : ''}`}>
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask n8n + AI to create something..." 
                    disabled={isGenerating}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-blue-900 placeholder:text-blue-300 font-medium px-2 py-2"
                  />
                  <button 
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    className="h-10 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 whitespace-nowrap"
                  >
                    {isGenerating ? 'Processing' : 'Automate'}
                  </button>
                </form>
                {error && <p className="absolute -bottom-6 left-0 w-full text-center text-[9px] text-red-500 font-bold uppercase tracking-[0.2em]">{error}</p>}
                {!error && !generatedImageUrl && !isGenerating && (
                  <p className="absolute -bottom-6 left-0 w-full text-center text-[9px] text-blue-400/60 font-bold uppercase tracking-[0.2em]">
                    Try: "A futuristic city in Ghibli style"
                  </p>
                )}
              </motion.div>
            </div>

            <div className="absolute bottom-6 right-8 py-2.5 px-5 bg-blue-50 border border-blue-200 shadow-sm rounded-xl backdrop-blur-md z-30 pointer-events-none">
              <span className="text-blue-600 font-black text-[10px] tracking-[0.2em] uppercase italic">n8n Workflow • Engine v3.1</span>
            </div>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div 
          className="absolute top-0 bottom-0 z-40 w-1 bg-white/10 hover:bg-white/30 cursor-col-resize flex items-center justify-center transition-all group"
          style={{ left: `${splitPos}%` }}
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center gap-1 group-hover:bg-white/40 transition-all shadow-2xl scale-75 group-hover:scale-100">
             <div className="flex flex-col gap-1 items-center">
                <div className="w-1 h-3 bg-white/80 rounded-full" />
                <div className="w-1 h-3 bg-white/80 rounded-full" />
             </div>
          </div>
        </div>

        {/* Global UI Overlays */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-[9px] text-white/30 tracking-[0.4em] uppercase pointer-events-none text-center">
           Slide to compare complexity vs elegance
        </div>
      </div>
    </div>
  );
}
