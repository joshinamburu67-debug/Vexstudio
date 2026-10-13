import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  X,
  RotateCcw,
  Wifi,
  Signal,
  Battery,
  Check,
  ChevronDown
} from 'lucide-react';

interface Props {
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const MobileDevicePreview: React.FC<Props> = ({
  isActive,
  onToggle,
  children
}) => {
  const [devicePreset, setDevicePreset] = useState<'iphone' | 'compact' | 'max'>('iphone');

  const widths = {
    compact: '360px',
    iphone: '390px',
    max: '430px'
  };

  const deviceNames = {
    compact: 'Android / Compact (360px)',
    iphone: 'iPhone 15 / Standard (390px)',
    max: 'iPhone Pro Max (430px)'
  };

  if (!isActive) {
    return (
      <>
        {children}

        {/* Floating Quick Toggle Button for Mobile Preview */}
        <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold shadow-xl border border-white/20 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
            title="Preview how survey members see this on their mobile phones"
          >
            <Smartphone className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span>Mobile Preview</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start py-4 px-2 select-none overflow-x-hidden relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Preview Control Bar */}
      <div className="relative z-30 max-w-4xl w-full mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl text-white shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>Mobile Phone Preview Mode</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-medium">
                Active Member View
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Simulating actual mobile screen for survey respondents
            </p>
          </div>
        </div>

        {/* Device Preset Switcher */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setDevicePreset('compact')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              devicePreset === 'compact'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            360px
          </button>
          <button
            type="button"
            onClick={() => setDevicePreset('iphone')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              devicePreset === 'iphone'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            390px (iPhone)
          </button>
          <button
            type="button"
            onClick={() => setDevicePreset('max')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              devicePreset === 'max'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            430px (Max)
          </button>
        </div>

        {/* Exit Preview Button */}
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 hover:text-white transition-colors border border-white/10 cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5 text-indigo-400" />
          <span>Exit Mobile Preview</span>
        </button>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div
        className="relative z-20 flex flex-col transition-all duration-300 mx-auto"
        style={{
          width: widths[devicePreset],
          maxWidth: '100%'
        }}
      >
        {/* Device Chassis Outer Shell */}
        <div className="bg-slate-900 rounded-[50px] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/20 relative">
          
          {/* Subtle Outer Metal Rim Reflections */}
          <div className="absolute inset-0 rounded-[50px] ring-2 ring-slate-800 pointer-events-none" />

          {/* Device Inner Screen Container */}
          <div className="w-full h-[780px] bg-slate-950 rounded-[40px] overflow-hidden flex flex-col relative">
            
            {/* Top Status Bar & Dynamic Island */}
            <div className="h-10 bg-black text-white px-7 flex items-center justify-between text-[11px] font-semibold shrink-0 z-30 select-none">
              <span>9:41</span>
              
              {/* Dynamic Island Pill */}
              <div className="w-24 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center gap-2 px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                <div className="w-2 h-2 rounded-full bg-indigo-950" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-slate-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Scrollable Viewport Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain select-text">
              {children}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="h-4 bg-black/95 flex items-center justify-center shrink-0 z-30">
              <div className="w-32 h-1 bg-white/40 rounded-full" />
            </div>

          </div>
        </div>

        {/* Device Label Info */}
        <div className="text-center text-[11px] text-slate-400 mt-3 font-medium flex items-center justify-center gap-2">
          <span>{deviceNames[devicePreset]}</span>
          <span>•</span>
          <span className="text-emerald-400">Touch &amp; Scroll Active</span>
        </div>
      </div>

    </div>
  );
};
