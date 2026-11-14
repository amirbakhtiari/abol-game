import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import foxSplashImg from '../assets/images/fox_ribbon_splash_1794661279209.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_DURATION_MS = 3800;

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FAF7F2] text-[#172B2E] flex items-center justify-center px-4 py-6 overflow-hidden"
    >
      {/* Ambient soft warm lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-28 -right-20 w-80 h-80 rounded-full bg-[#E85D3F]/12 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 w-96 h-96 rounded-full bg-[#0F5E63]/12 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-white/92 backdrop-blur-xl rounded-3xl border border-[#172B2E]/10 shadow-[0_24px_60px_rgba(23,43,46,0.08)] overflow-hidden"
      >
        {/* Top silk ribbon accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-l from-[#E85D3F] via-[#F28C6A] to-[#0F5E63]" />

        <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-5">
          {/* Illustrated Fox + Ribbon Hero */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#172B2E]/8"
          >
            {!imgError ? (
              <img
                src={foxSplashImg}
                alt="روباه کوچولوی داستان با پاپیون روبانی"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F9F2E7] to-[#EFE5D5] text-[#0F5E63]">
                <Sparkles className="w-10 h-10 text-[#E85D3F]" />
                <span className="text-sm font-medium">خوش اومدی</span>
              </div>
            )}
          </motion.div>

          {/* Splash Title & Copy */}
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="font-display text-3xl sm:text-4xl text-[#172B2E] leading-snug [text-wrap:balance]"
            >
              ماهی قرمز توی آکواریوم
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="text-sm sm:text-base text-[#172B2E]/70 leading-relaxed"
            >
              یه سوال کوچیک و یه دعوت شیرین منتظرته...
            </motion.p>
          </div>

          {/* Interactive Enter CTA */}
          <motion.button
            type="button"
            onClick={onComplete}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full min-h-[48px] px-7 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#D84E30] text-white font-bold text-base shadow-[0_10px_24px_rgba(232,93,63,0.28)] flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F5E63]"
          >
            <span>بزن بریم</span>
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Auto-advance progress bar */}
        <div className="w-full h-1 bg-[#172B2E]/8 overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: SPLASH_DURATION_MS / 1000, ease: 'linear' }}
            className="h-full bg-[#0F5E63] origin-right"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
