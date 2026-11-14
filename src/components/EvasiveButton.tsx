import { useRef, useState, useEffect, type RefObject } from 'react';
import { motion } from 'motion/react';

interface EvasiveButtonProps {
  id: string;
  label: string;
  arenaRef: RefObject<HTMLDivElement | null>;
  positiveRef: RefObject<HTMLButtonElement | null>;
  onDodge: (burstPos: { x: number; y: number }) => void;
  dodgeCount: number;
  className?: string;
}

export function EvasiveButton({
  id,
  label,
  arenaRef,
  positiveRef,
  onDodge,
  dodgeCount,
  className = '',
}: EvasiveButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<number>(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tilt, setTilt] = useState<number>(0);
  const [jumpKey, setJumpKey] = useState<number>(0);

  // Reset position when question/button id changes
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setTilt(0);
    setJumpKey(0);
  }, [id]);

  // Also reset if viewport resizes dramatically so button never gets stranded outside arena
  useEffect(() => {
    const handleResize = () => {
      setOffset({ x: 0, y: 0 });
      setTilt(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerEscape = (clientX?: number, clientY?: number) => {
    const now = Date.now();
    if (now - lastTriggerRef.current < 130) return;
    lastTriggerRef.current = now;

    const arenaEl = arenaRef.current;
    const btnEl = buttonRef.current;
    if (!arenaEl || !btnEl) return;

    const arenaRect = arenaEl.getBoundingClientRect();
    const btnRect = btnEl.getBoundingClientRect();
    const posRect = positiveRef.current?.getBoundingClientRect();

    // Calculate burst origin relative to arena before moving
    const burstX = btnRect.left - arenaRect.left + btnRect.width / 2;
    const burstY = btnRect.top - arenaRect.top + btnRect.height / 2;

    // Un-transformed origin of this button in viewport space
    const homeLeft = btnRect.left - offset.x;
    const homeTop = btnRect.top - offset.y;
    const btnW = btnRect.width;
    const btnH = btnRect.height;

    const padding = 10;
    const minX = arenaRect.left + padding - homeLeft;
    const maxX = arenaRect.right - padding - btnW - homeLeft;
    const minY = arenaRect.top + padding - homeTop;
    const maxY = arenaRect.bottom - padding - btnH - homeTop;

    const safeMinX = Math.min(minX, maxX);
    const safeMaxX = Math.max(minX, maxX);
    const safeMinY = Math.min(minY, maxY);
    const safeMaxY = Math.max(minY, maxY);

    let bestX = offset.x;
    let bestY = offset.y;
    let bestScore = -Infinity;

    for (let i = 0; i < 36; i++) {
      const candX = safeMinX + Math.random() * (safeMaxX - safeMinX);
      const candY = safeMinY + Math.random() * (safeMaxY - safeMinY);

      const candLeft = homeLeft + candX;
      const candRight = candLeft + btnW;
      const candTop = homeTop + candY;
      const candBottom = candTop + btnH;

      // Avoid overlapping the positive button
      let overlapsPositive = false;
      if (posRect) {
        const buffer = 12;
        overlapsPositive = !(
          candRight + buffer < posRect.left ||
          candLeft - buffer > posRect.right ||
          candBottom + buffer < posRect.top ||
          candTop - buffer > posRect.bottom
        );
      }

      const distFromCurrent = Math.hypot(candX - offset.x, candY - offset.y);
      const distFromPointer =
        clientX !== undefined && clientY !== undefined
          ? Math.hypot(candLeft + btnW / 2 - clientX, candTop + btnH / 2 - clientY)
          : distFromCurrent;

      // Prefer candidates that don't overlap positive button and jump far from finger/cursor
      const score =
        (overlapsPositive ? -10000 : 0) +
        Math.min(distFromCurrent, 220) * 1.1 +
        Math.min(distFromPointer, 240);

      if (distFromCurrent >= 55 && score > bestScore) {
        bestScore = score;
        bestX = candX;
        bestY = candY;
      }
    }

    // Fallback if arena is extremely tight
    if (bestScore === -Infinity) {
      bestX = offset.x > (safeMinX + safeMaxX) / 2 ? safeMinX : safeMaxX;
      bestY = offset.y > (safeMinY + safeMaxY) / 2 ? safeMinY : safeMaxY;
    }

    const nextTilt = (Math.random() > 0.5 ? 1 : -1) * (6 + Math.random() * 10);

    setOffset({ x: bestX, y: bestY });
    setTilt(nextTilt);
    setJumpKey((k) => k + 1);
    onDodge({ x: burstX, y: burstY });
  };

  // Gently shrink slightly after multiple dodges to look mischievously nimble, while keeping >=44px touch target
  const shrinkScale = Math.max(0.86, 1 - dodgeCount * 0.025);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      tabIndex={-1}
      aria-label={`${label} (غیرقابل انتخاب)`}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') {
          triggerEscape(e.clientX, e.clientY);
        }
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerEscape(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        const touch = e.touches[0];
        triggerEscape(touch?.clientX, touch?.clientY);
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerEscape(e.clientX, e.clientY);
      }}
      animate={{
        x: offset.x,
        y: offset.y,
        rotate: tilt,
        scale: jumpKey === 0 ? 1 : [shrinkScale * 0.85, shrinkScale * 1.08, shrinkScale],
      }}
      transition={{
        x: { type: 'spring', stiffness: 520, damping: 22, mass: 0.65 },
        y: { type: 'spring', stiffness: 520, damping: 22, mass: 0.65 },
        rotate: { type: 'spring', stiffness: 360, damping: 18 },
        scale: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
      }}
      className={`relative z-20 select-none touch-none min-h-[48px] px-6 py-3 rounded-2xl font-semibold text-base whitespace-nowrap shrink-0 cursor-pointer border border-[#172B2E]/15 bg-white text-[#172B2E]/80 shadow-sm hover:bg-white focus:outline-none ${className}`}
    >
      {label}
    </motion.button>
  );
}
