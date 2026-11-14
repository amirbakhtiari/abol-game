import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fish, Coffee } from 'lucide-react';
import goldfishHeroImg from '../assets/images/goldfish_aquarium_hero_1794660863360.jpg';
import herbalTeaImg from '../assets/images/herbal_tea_finale_1794660863830.jpg';

import { toPersianDigits } from '../data/questions';

interface StoryVisualProps {
  theme: 'goldfish' | 'tea';
  stepNumber: number;
  totalSteps: number;
  chapterTitle: string;
  isFinale?: boolean;
}

export function StoryVisual({
  theme,
  stepNumber,
  totalSteps,
  chapterTitle,
  isFinale = false,
}: StoryVisualProps) {
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const imageSrc = theme === 'tea' ? herbalTeaImg : goldfishHeroImg;
  const imageAlt =
    theme === 'tea'
      ? 'فنجان دمنوش زعفرانی گرم و برگ نعنا روی میز چوبی'
      : 'ماهی قرمز توی آکواریوم شیشه‌ای گرد با حباب‌های آب';

  const hasError = imgError[theme] === true;

  return (
    <div className="relative flex flex-col justify-between h-full gap-2.5">
      <div className="relative overflow-hidden rounded-2xl bg-[#F2ECE1] border border-[#172B2E]/10 h-44 sm:h-56 lg:h-full lg:min-h-[260px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full"
          >
            {!hasError ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                referrerPolicy="no-referrer"
                onError={() => setImgError((prev) => ({ ...prev, [theme]: true }))}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F7EFE4] to-[#E9DFCE] text-[#0F5E63] p-6">
                {theme === 'tea' ? (
                  <Coffee className="w-12 h-12 text-[#E85D3F]" strokeWidth={1.6} />
                ) : (
                  <Fish className="w-12 h-12 text-[#E85D3F]" strokeWidth={1.6} />
                )}
                <span className="text-sm font-medium text-[#172B2E]/70">{chapterTitle}</span>
              </div>
            )}

            {/* Gentle ambient floating bubbles on goldfish theme */}
            {theme === 'goldfish' && !hasError && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                {[0, 1, 2].map((idx) => (
                  <motion.span
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: [-10, -70],
                      opacity: [0, 0.55, 0],
                    }}
                    transition={{
                      duration: 3.4 + idx * 0.9,
                      repeat: Infinity,
                      delay: idx * 1.1,
                      ease: 'easeOut',
                    }}
                    className="absolute rounded-full border border-white/80 bg-white/30"
                    style={{
                      width: 8 + idx * 4,
                      height: 8 + idx * 4,
                      left: `${38 + idx * 11}%`,
                      bottom: '28%',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Gentle rising warmth shimmer on tea theme */}
            {theme === 'tea' && !hasError && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                {[0, 1].map((idx) => (
                  <motion.span
                    key={idx}
                    animate={{
                      y: [0, -35],
                      opacity: [0, 0.35, 0],
                      scale: [0.9, 1.15],
                    }}
                    transition={{
                      duration: 3.2 + idx * 0.8,
                      repeat: Infinity,
                      delay: idx * 1.4,
                      ease: 'easeInOut',
                    }}
                    className="absolute w-10 h-10 rounded-full bg-white/40 blur-md"
                    style={{
                      left: `${44 + idx * 8}%`,
                      top: '36%',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Unboxed editorial caption row */}
      <div className="mt-3 flex items-center justify-between text-xs sm:text-sm text-[#172B2E]/65 px-1">
        <span className="font-medium text-[#0F5E63]">{chapterTitle}</span>
        <span className="tabular-nums">
          {isFinale ? 'پایان خوش' : `بخش ${toPersianDigits(stepNumber)} از ${toPersianDigits(totalSteps)}`}
        </span>
      </div>
    </div>
  );
}
