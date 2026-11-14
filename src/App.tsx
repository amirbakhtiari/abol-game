import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, RotateCcw, Sparkles, ArrowLeft, ArrowDown, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { QUESTIONS, toPersianDigits } from './data/questions';
import { EvasiveButton } from './components/EvasiveButton';
import { ParticleBurst, type BurstEvent } from './components/ParticleBurst';
import { StoryVisual } from './components/StoryVisual';
import { SplashScreen } from './components/SplashScreen';
import { playAcceptSound, playCelebrationSound, playDodgeSound } from './utils/sound';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [stepDodgeCount, setStepDodgeCount] = useState<number>(0);
  const [totalDodgeCount, setTotalDodgeCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bursts, setBursts] = useState<BurstEvent[]>([]);

  const arenaRef = useRef<HTMLDivElement>(null);
  const positiveRef = useRef<HTMLButtonElement>(null);
  const burstIdRef = useRef<number>(0);

  const currentQuestion = QUESTIONS[stepIndex] ?? QUESTIONS[0];
  const progressPercent = isCompleted
    ? 100
    : ((stepIndex + 1) / QUESTIONS.length) * 100;

  // Clean up old particle bursts automatically
  useEffect(() => {
    if (bursts.length === 0) return;
    const timer = setTimeout(() => {
      setBursts((prev) => prev.slice(Math.max(0, prev.length - 4)));
    }, 650);
    return () => clearTimeout(timer);
  }, [bursts]);

  const handleDodge = useCallback(
    (burstPos: { x: number; y: number }) => {
      const nextBurstId = ++burstIdRef.current;
      setBursts((prev) => [
        ...prev.slice(-6),
        {
          id: nextBurstId,
          x: burstPos.x,
          y: burstPos.y,
          colorIndex: nextBurstId,
        },
      ]);

      setStepDodgeCount((prev) => {
        const next = prev + 1;
        playDodgeSound(soundEnabled, next);
        return next;
      });
      setTotalDodgeCount((prev) => prev + 1);
    },
    [soundEnabled]
  );

  const handleAccept = () => {
    if (stepIndex < QUESTIONS.length - 1) {
      playAcceptSound(soundEnabled);
      setStepIndex((prev) => prev + 1);
      setStepDodgeCount(0);
      setBursts([]);
    } else {
      playCelebrationSound(soundEnabled);
      setIsCompleted(true);
      setStepDodgeCount(0);
      setBursts([]);
    }
  };

  const handleRestart = () => {
    playAcceptSound(soundEnabled);
    setStepIndex(0);
    setIsCompleted(false);
    setStepDodgeCount(0);
    setTotalDodgeCount(0);
    setBursts([]);
  };

  const enteredSplashRef = useRef<boolean>(false);

  const handleEnterFromSplash = useCallback(() => {
    if (enteredSplashRef.current) return;
    enteredSplashRef.current = true;
    playAcceptSound(soundEnabled);
    setShowSplash(false);
  }, [soundEnabled]);

  const activeTaunt =
    stepDodgeCount > 0
      ? currentQuestion.taunts[(stepDodgeCount - 1) % currentQuestion.taunts.length]
      : null;

  const positiveScaleBoost = 1 + Math.min(stepDodgeCount * 0.03, 0.14);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={handleEnterFromSplash} />
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[100dvh] w-full bg-[#FAF7F2] text-[#172B2E] flex flex-col overflow-x-hidden"
        >
      {/* Subtle warm organic ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-28 -right-24 w-80 h-80 rounded-full bg-[#E85D3F]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-[#0F5E63]/10 blur-3xl" />
      </div>

      {/* Compact single-row top bar */}
      <header className="relative z-20 w-full border-b border-[#172B2E]/8 bg-[#FAF7F2]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display text-lg sm:text-xl tracking-tight text-[#172B2E] whitespace-nowrap truncate">
              ماهی قرمز توی آکواریوم
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs sm:text-sm font-medium text-[#172B2E]/65 tabular-nums whitespace-nowrap">
              {isCompleted
                ? '۵ از ۵'
                : `${toPersianDigits(stepIndex + 1)} از ${toPersianDigits(QUESTIONS.length)}`}
            </span>

            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label={soundEnabled ? 'قطع صدا' : 'روشن کردن صدا'}
              title={soundEnabled ? 'قطع صدا' : 'روشن کردن صدا'}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#172B2E]/70 hover:text-[#172B2E] hover:bg-[#172B2E]/5 transition-colors focus-visible:outline-2 focus-visible:outline-[#0F5E63] cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Hairline step progress bar */}
        <div className="w-full h-[3px] bg-[#172B2E]/8 overflow-hidden">
          <motion.div
            className="h-full bg-[#E85D3F] origin-right"
            initial={false}
            animate={{ scaleX: progressPercent / 100 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%' }}
          />
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-3 py-4 sm:px-6 sm:py-8">
        <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl border border-[#172B2E]/10 shadow-[0_20px_50px_rgba(23,43,46,0.06)] p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch">
            {/* Visual Column */}
            <div className="lg:col-span-5 flex flex-col">
              <StoryVisual
                theme={isCompleted ? 'tea' : currentQuestion.visualTheme}
                stepNumber={stepIndex + 1}
                totalSteps={QUESTIONS.length}
                chapterTitle={
                  isCompleted ? 'دمنوش و گفتگو' : currentQuestion.chapterTitle
                }
                isFinale={isCompleted}
              />
            </div>

            {/* Interactive Question / Finale Column */}
            <div className="lg:col-span-7 flex flex-col justify-between min-h-[320px] sm:min-h-[360px]">
              <AnimatePresence mode="wait">
                {!isCompleted ? (
                  <motion.div
                    key={`step-${currentQuestion.id}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col flex-1 justify-between gap-4 sm:gap-5"
                  >
                    {/* Question Text Header */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#0F5E63] font-medium">
                        <span className="tabular-nums">
                          پرسش {toPersianDigits(stepIndex + 1)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{currentQuestion.chapterTitle}</span>
                      </div>

                      <h1 className="text-lg sm:text-2xl lg:text-[26px] font-bold leading-relaxed text-[#172B2E] [text-wrap:balance]">
                        {currentQuestion.question}
                      </h1>

                      {/* Dynamic playful taunt feedback */}
                      <div className="min-h-[24px] flex items-center">
                        <AnimatePresence mode="wait">
                          {activeTaunt ? (
                            <motion.p
                              key={`${stepIndex}-${stepDodgeCount}`}
                              initial={{ opacity: 0, y: 4, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs sm:text-sm font-medium text-[#E85D3F]"
                            >
                              {activeTaunt}
                            </motion.p>
                          ) : (
                            <p className="text-xs sm:text-sm text-[#172B2E]/50">
                              گزینه مورد نظرت رو انتخاب کن
                            </p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Bounded Runaway Button Playground */}
                    <div
                      ref={arenaRef}
                      className="relative flex-1 min-h-[205px] sm:min-h-[235px] w-full rounded-2xl bg-[#FAF7F2]/90 border border-[#172B2E]/8 p-4 sm:p-6 flex items-center justify-center overflow-hidden"
                    >
                      <ParticleBurst bursts={bursts} />

                      {currentQuestion.evasiveOptions.length === 1 ? (
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                          <motion.button
                            ref={positiveRef}
                            type="button"
                            onClick={handleAccept}
                            animate={{ scale: positiveScaleBoost }}
                            whileHover={{ scale: positiveScaleBoost * 1.04 }}
                            whileTap={{ scale: positiveScaleBoost * 0.96 }}
                            transition={{
                              type: 'spring',
                              stiffness: 420,
                              damping: 22,
                            }}
                            className="relative z-10 min-h-[48px] min-w-[116px] px-7 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#D84E30] text-white font-bold text-base shadow-[0_10px_24px_rgba(232,93,63,0.28)] flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F5E63]"
                          >
                            <span>{currentQuestion.positiveLabel}</span>
                            <ArrowLeft className="w-4 h-4 opacity-90" />
                          </motion.button>

                          <EvasiveButton
                            id={currentQuestion.evasiveOptions[0].id}
                            label={currentQuestion.evasiveOptions[0].label}
                            arenaRef={arenaRef}
                            positiveRef={positiveRef}
                            onDodge={handleDodge}
                            dodgeCount={stepDodgeCount}
                            className="min-w-[108px]"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm">
                          {currentQuestion.evasiveOptions.map((opt) => (
                            <EvasiveButton
                              key={opt.id}
                              id={opt.id}
                              label={opt.label}
                              arenaRef={arenaRef}
                              positiveRef={positiveRef}
                              onDodge={handleDodge}
                              dodgeCount={stepDodgeCount}
                              className="w-full"
                            />
                          ))}

                          <motion.button
                            ref={positiveRef}
                            type="button"
                            onClick={handleAccept}
                            animate={{ scale: positiveScaleBoost }}
                            whileHover={{ scale: positiveScaleBoost * 1.04 }}
                            whileTap={{ scale: positiveScaleBoost * 0.96 }}
                            transition={{
                              type: 'spring',
                              stiffness: 420,
                              damping: 22,
                            }}
                            className="relative z-10 w-full min-h-[48px] px-5 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#D84E30] text-white font-bold text-base shadow-[0_10px_24px_rgba(232,93,63,0.28)] flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F5E63]"
                          >
                            <span>{currentQuestion.positiveLabel}</span>
                            <ArrowLeft className="w-4 h-4 opacity-90" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="finale-screen"
                    initial={{ opacity: 0, scale: 0.97, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col flex-1 justify-between gap-6 py-2"
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-[#0F5E63]">
                        <Sparkles className="w-4 h-4 text-[#E85D3F]" />
                        <span>موافقت کامل ثبت شد</span>
                      </div>

                      <h1 className="font-display text-3xl sm:text-4xl text-[#172B2E] leading-snug [text-wrap:balance]">
                        قرار دمنوش قطعی شد!
                      </h1>

                      <p className="text-base sm:text-lg font-semibold leading-relaxed text-[#E85D3F]">
                        من خطمو پرداخت نکردم میخوای ارتباط بگیری اینو اسکن کن
                      </p>

                      {/* Centered Instagram QR Code with animated pointing arrow */}
                      <div className="flex flex-col items-center justify-center gap-3 pt-1 w-full">
                        <motion.div
                          animate={{ y: [0, 6, 0] }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="text-[#E85D3F]"
                          aria-hidden="true"
                        >
                          <ArrowDown className="w-6 h-6 stroke-[2.5]" />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.12, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="p-3.5 rounded-2xl bg-white border border-[#172B2E]/12 shadow-sm shrink-0"
                        >
                          <QRCodeSVG
                            value="https://www.instagram.com/abolfazlhassanpour10"
                            size={164}
                            level="M"
                            fgColor="#172B2E"
                            bgColor="#FFFFFF"
                          />
                        </motion.div>

                        <a
                          href="https://www.instagram.com/abolfazlhassanpour10"
                          target="_blank"
                          rel="noopener noreferrer"
                          dir="ltr"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F5E63] hover:text-[#E85D3F] transition-colors underline underline-offset-4"
                        >
                          <span>@abolfazlhassanpour10</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* Clean unboxed summary stats */}
                      <div className="pt-3 border-t border-[#172B2E]/10 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-[#172B2E]/70">
                        <span className="tabular-nums">
                          مراحل تکمیل‌شده: {toPersianDigits(QUESTIONS.length)} از{' '}
                          {toPersianDigits(QUESTIONS.length)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          تلاش‌های ناموفق برای «نه» گفتن:{' '}
                          <strong className="font-bold text-[#E85D3F]">
                            {toPersianDigits(totalDodgeCount)} بار
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <motion.button
                        type="button"
                        onClick={handleRestart}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="min-h-[48px] px-7 py-3 rounded-2xl bg-[#0F5E63] hover:bg-[#0B4A4E] text-white font-semibold text-base shadow-[0_10px_24px_rgba(15,94,99,0.22)] flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E85D3F]"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>شروع دوباره</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
