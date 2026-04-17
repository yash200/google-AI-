import React from 'react';
import { motion } from 'motion/react';

export const QuillNote = () => (
  <motion.div 
    className="relative"
    animate={{ 
      y: [0, -4, 0],
      rotate: [2, -2, 2]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    {/* Note Paper */}
    <div className="w-10 h-14 bg-[#fffef0] shadow-[0_4px_10px_rgba(0,0,0,0.1)] border border-yellow-100/50 rounded-sm relative transform rotate-1">
      <div className="absolute top-3 left-2 right-2 h-[1px] bg-gray-200/50" />
      <div className="absolute top-5 left-2 right-2 h-[1px] bg-gray-200/50" />
      <div className="absolute top-7 left-2 right-2 h-[1px] bg-gray-200/50" />
      <div className="absolute top-9 left-2 right-4 h-[1px] bg-gray-200/50" />
      
      {/* Hand-written squiggle */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 40 56">
        <path d="M10 15 Q 15 12, 20 15 T 30 15" fill="none" stroke="black" strokeWidth="0.5" />
        <path d="M10 25 Q 15 22, 20 25 T 30 25" fill="none" stroke="black" strokeWidth="0.5" />
      </svg>
    </div>
    {/* Quill Pen */}
    <motion.div 
      className="absolute -top-6 -right-4 w-12 h-12 pointer-events-none"
      animate={{ rotate: [45, 40, 45] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-[2px] h-10 bg-gray-400 rotate-12 origin-bottom absolute bottom-2 left-6" />
      <div className="w-4 h-8 bg-gray-100 rounded-full opacity-60 rotate-12 absolute bottom-4 left-4 blur-[0.5px]" />
    </motion.div>
  </motion.div>
);

export const JenkinsForklift = ({ isPanic = false }) => {
  return (
    <div className="relative w-80 h-64 flex items-end justify-center">
      {/* Spark Effects during Panic */}
      {isPanic && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{ x: 160 + (Math.random() - 0.5) * 100, y: 100 }}
              animate={{ 
                x: 160 + (Math.random() - 0.5) * 200, 
                y: 300, 
                opacity: 0,
                scale: 2 
              }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      )}

      {/* Forklift Body */}
      <motion.div 
        className="relative z-10"
        animate={isPanic ? { 
          x: [-3, 3, -3],
          y: [-2, 2, -2]
        } : { 
          x: [-1, 1, -1],
          y: [-0.5, 0.5, -0.5]
        }}
        transition={{ 
          duration: isPanic ? 0.05 : 0.1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div className="absolute -left-2 bottom-4 w-12 h-56 bg-gray-800 border-x-4 border-gray-700 opacity-90" />
        
        <div className={`w-56 h-36 bg-[#cc9900] rounded-xl relative border-b-8 shadow-2xl overflow-hidden transition-colors duration-500 ${isPanic ? 'border-red-900 bg-red-800' : 'border-yellow-800 bg-[#cc9900]'}`}>
          <div className="absolute top-4 left-6 w-12 h-6 bg-orange-950/40 blur-md rounded-full" />
          <div className="absolute bottom-10 right-12 w-20 h-10 bg-orange-950/30 blur-md rounded-full" />
          
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/40 px-3 py-1.5 rounded-sm border border-yellow-500/20">
            <div className={`text-[12px] font-mono font-black uppercase tracking-[0.2em] transition-colors ${isPanic ? 'text-red-400' : 'text-yellow-500'}`}>
              {isPanic ? 'ERROR 404' : 'Jenkins'}
            </div>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 h-10 flex flex-col gap-1.5 opacity-60">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-1.5 bg-black rounded-full shadow-inner" />
            ))}
          </div>

          {/* Red warning light */}
          {isPanic && (
            <motion.div 
              className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            />
          )}
        </div>
        
        <div className="absolute -bottom-6 left-6 w-16 h-16 bg-[#1a1a1a] rounded-full border-8 border-[#222] shadow-xl" />
        <div className="absolute -bottom-6 right-6 w-16 h-16 bg-[#1a1a1a] rounded-full border-8 border-[#222] shadow-xl" />
        
        <motion.div 
          className="absolute -left-24 bottom-14 w-32 h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-r-lg border-2 border-gray-500/50 shadow-2xl origin-right px-2 flex items-center justify-end"
          animate={{ 
            y: isPanic ? [-30, 30, -30] : [-15, 15, -15],
            rotate: isPanic ? [-15, 15, -15] : [-8, 8, -8]
          }}
          transition={{ 
            duration: isPanic ? 0.5 : 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="absolute -right-4 top-[-20px] w-2 h-20 bg-gray-900/50 rounded-full blur-[1px]" />
          <motion.div 
            className="absolute -bottom-2 left-6 w-2.5 h-6 bg-black rounded-full blur-[0.5px]"
            animate={{ 
              y: [0, 60],
              opacity: [1, 0],
              scaleY: [1, 2, 0.5]
            }}
            transition={{ 
              duration: isPanic ? 0.4 : 1.2, 
              repeat: Infinity, 
              ease: "easeIn" 
            }}
          />
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-0 w-80 h-12 bg-black/30 blur-2xl rounded-full" />
    </div>
  );
};

export const RobotN8N = ({ mousePos = { x: 0, y: 0 } }) => {
  const headRef = React.useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (headRef.current) {
      const rect = headRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = (mousePos.x - centerX) / (window.innerWidth / 2);
      const dy = (mousePos.y - centerY) / (window.innerHeight / 2);
      
      setEyeOffset({ x: dx * 8, y: dy * 4 });
    }
  }, [mousePos]);

  return (
    <div className="relative w-80 h-72 flex items-center justify-center">
      <motion.div 
        className="relative z-10"
        animate={{ y: [-12, 12, -12] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div ref={headRef} className="w-24 h-20 bg-white shadow-[0_10px_40px_rgba(59,130,246,0.15)] rounded-[2.5rem] border border-blue-50 relative overflow-hidden flex flex-col items-center justify-center gap-2">
          <div className="w-16 h-6 bg-blue-50/50 rounded-full flex gap-3 justify-center items-center relative pr-1">
             <div className="absolute inset-0 bg-gradient-to-t from-blue-100/20 to-transparent pointer-events-none" />
            <motion.div 
              className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.9)]"
              animate={{ x: eyeOffset.x, y: eyeOffset.y }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
            <motion.div 
              className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.9)]"
              animate={{ x: eyeOffset.x, y: eyeOffset.y }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
          <div className="text-[9px] font-black text-blue-400/60 uppercase tracking-widest px-2 py-0.5 bg-blue-50/50 rounded-full">
            n8n • AI
          </div>
          <motion.div 
             className="absolute top-0 w-full h-1 bg-blue-400"
             animate={{ opacity: [0.2, 0.8, 0.2] }}
             transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        
        <div className="mt-3 w-20 h-28 bg-white border border-blue-50 rounded-t-lg rounded-b-[3rem] shadow-xl relative mx-auto overflow-hidden">
          <motion.div 
            className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-100/50"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-blue-50" />
        </div>
        
        <motion.div 
          className="absolute -right-16 top-12 w-28 h-6 flex items-center justify-center p-1"
          animate={{ rotate: [-4, 4, -4], x: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-3 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm" />
          <motion.div 
            className="absolute right-0 w-10 h-10 bg-blue-400/5 rounded-full blur-md"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-2 w-48 h-8 bg-blue-200/20 blur-2xl rounded-full"
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export const GeneratedAsset = ({ url, type = 'image', onDownload }: { url: string, type?: 'image' | 'video', onDownload: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="group relative w-24 h-24 bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden flex flex-col pt-1"
  >
    <div className="flex-1 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
      {type === 'image' ? (
        <img src={url} alt="Generated Asset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className="relative w-full h-full bg-blue-900 flex items-center justify-center">
          <video src={url} className="w-full h-full object-cover" autoPlay loop muted />
          <div className="absolute inset-0 flex items-center justify-center bg-blue-900/40">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
        </div>
      )}
    </div>
    <div className="h-6 bg-blue-50/50 flex items-center justify-between px-2">
      <span className="text-[6px] font-bold text-blue-600 truncate uppercase">
        {type === 'image' ? 'Asset.png' : 'Motion.mp4'}
      </span>
      <button 
        onClick={(e) => { e.stopPropagation(); onDownload(); }}
        className="p-1 hover:bg-blue-100 rounded-md transition-colors"
      >
        <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
  </motion.div>
);

export const NotionDashboard = ({ assetUrl, assetType = 'image', onDownloadAsset }: { assetUrl?: string, assetType?: 'image' | 'video', onDownloadAsset?: () => void }) => (
  <motion.div 
    animate={assetUrl ? { scale: [1, 1.02, 1], transition: { duration: 0.5 } } : {}}
    className="w-56 h-40 bg-white rounded-xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.1)] flex overflow-hidden group cursor-pointer relative"
  >
    <div className="w-16 bg-[#f7f7f5] h-full p-2 flex flex-col gap-2">
       <div className="w-6 h-6 bg-gray-200 rounded-md" />
       {[...Array(4)].map((_, i) => (
         <div key={i} className="w-full h-1.5 bg-gray-300/30 rounded-full" />
       ))}
    </div>
    <div className="flex-1 p-3 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-500 rounded-sm" />
        <div className="h-3 w-24 bg-gray-100 rounded-md" />
      </div>
      
      {assetUrl ? (
        <div className="mt-1 flex justify-center">
          <GeneratedAsset url={assetUrl} type={assetType} onDownload={onDownloadAsset || (() => {})} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="h-12 bg-blue-50/40 rounded-lg flex items-center justify-center border border-blue-50">
              <div className="w-10 h-2 bg-blue-200 rounded-full" />
            </div>
            <div className="h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-50">
              <div className="w-10 h-2 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="h-10 bg-[#fdfdfd] border border-green-100/50 rounded-lg flex items-center px-2 gap-2">
            <div className="w-2.5 h-2.5 bg-green-500/60 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
            <div className="h-2 w-full bg-gray-100/50 rounded-full" />
          </div>
        </>
      )}
    </div>
  </motion.div>
);

export const DataStream = ({ delay = 0 }) => (
  <motion.div
    className="absolute h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent w-64 z-20 pointer-events-none"
    initial={{ x: -250, opacity: 0 }}
    animate={{ 
      x: [0, 500],
      opacity: [0, 1, 1, 0]
    }}
    transition={{ 
      duration: 3, 
      repeat: Infinity, 
      delay,
      ease: [0.4, 0, 0.6, 1]
    }}
  />
);


