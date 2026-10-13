import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onComplete: () => void;
}

export const EyesIntro: React.FC<Props> = ({ onComplete }) => {
  const [splashState, setSplashState] = useState<'showing' | 'fading' | 'gone'>('showing');
  const [progress, setProgress] = useState(0);
  const [introState, setIntroState] = useState<'playing' | 'closing' | 'gone'>('playing');
  const [showFallback, setShowFallback] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const isRevealedRef = useRef(false);

  const INTRO_FILM_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260922_195107_ed3f055a-3a13-4a71-b743-e10310454246.mp4';

  const triggerReveal = () => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;

    // Start closing veil
    setIntroState('closing');

    // Smooth transition into main app
    setTimeout(() => {
      setIntroState('gone');
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 1000);
  };

  // Splash loading progression
  useEffect(() => {
    const splashStart = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - splashStart;
      const pct = Math.min(1, elapsed / 900);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          setSplashState('fading');
          setTimeout(() => {
            setSplashState('gone');
          }, 600);
        }, 250);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Video playback management
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', '');

    const handlePlay = () => {
      video.playbackRate = 2;
    };

    const handlePlaying = () => {
      video.playbackRate = 2;
      const dur = video.duration || 4;
      const cur = video.currentTime || 0;
      const cutTimeSec = Math.max(0.3, (dur - cur - 0.45) / 2);
      setTimeout(() => {
        triggerReveal();
      }, cutTimeSec * 1000);
    };

    const handleEnded = () => {
      triggerReveal();
    };

    const handleError = () => {
      setShowFallback(true);
      setTimeout(triggerReveal, 1400);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Initial play trigger
    const startPlay = () => {
      if (video.currentTime > 0.05) video.currentTime = 0;
      video.playbackRate = 2;
      const p = video.play();
      if (p && p.catch) {
        p.catch(() => {
          // Autoplay blocked: wait for first interaction
          const onFirstInteraction = () => {
            ['pointerdown', 'keydown', 'touchstart'].forEach(evt =>
              window.removeEventListener(evt, onFirstInteraction)
            );
            if (video.currentTime > 0.05) video.currentTime = 0;
            video.playbackRate = 2;
            video.play().catch(() => {});
          };
          ['pointerdown', 'keydown', 'touchstart'].forEach(evt =>
            window.addEventListener(evt, onFirstInteraction, { once: true })
          );

          // If still paused after 2.6s, proceed anyway
          setTimeout(() => {
            if (video.paused) triggerReveal();
          }, 2600);
        });
      }
    };

    // Attempt autoplay
    startPlay();

    // Absolute backstop timeout (12 seconds)
    const backstop = setTimeout(triggerReveal, 12000);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      clearTimeout(backstop);
    };
  }, []);

  if (introState === 'gone') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black text-[#f4f2ef] overflow-hidden select-none transition-opacity duration-500 ${
        introState === 'gone' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        fontFamily: '"Playfair Display", Georgia, serif'
      }}
    >
      {/* Intro Eye Film */}
      <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={INTRO_FILM_URL}
          playsInline
          muted
          autoPlay
          preload="auto"
          className="w-full h-full object-cover"
        />

        {/* Fallback Gradient if video fails */}
        {showFallback && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,#14301a_0%,#060c07_42%,#000000_72%)] transition-opacity duration-500" />
        )}

        {/* Black Veil Fade Transition */}
        <div
          className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-[1150ms] ease-out ${
            introState === 'closing' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Skip Button */}
        <button
          type="button"
          onClick={triggerReveal}
          className={`absolute bottom-6 sm:bottom-8 right-6 sm:right-8 z-30 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#f4f2ef]/70 hover:text-white px-5 py-2.5 rounded-full border border-white/25 hover:border-white/70 bg-black/30 backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-95 ${
            introState === 'closing' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          Skip Intro
        </button>
      </div>

      {/* Splash Screen Overlay */}
      {splashState !== 'gone' && (
        <div
          className={`absolute inset-0 z-40 bg-black flex flex-col items-center justify-center gap-6 transition-opacity duration-600 ease-out ${
            splashState === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Brand Mark */}
          <div className="text-3xl sm:text-5xl font-normal tracking-wide text-[#f4f2ef] animate-in fade-in slide-in-from-bottom-2 duration-1000">
            Vexlora <span className="text-indigo-400 not-italic font-normal">Surveys</span>
          </div>

          {/* Minimal 1px Progress Bar */}
          <div className="w-36 sm:w-48 h-[1px] bg-white/20 overflow-hidden relative">
            <div
              className="h-full bg-white transition-transform duration-300 ease-out origin-left"
              style={{
                transform: `scaleX(${progress})`
              }}
            />
          </div>

          {/* Subtitle Tag */}
          <div className="font-sans text-[10px] tracking-[0.28em] uppercase text-white/45 animate-in fade-in duration-1000 delay-300">
            Product Feedback &amp; Insights
          </div>
        </div>
      )}
    </div>
  );
};
