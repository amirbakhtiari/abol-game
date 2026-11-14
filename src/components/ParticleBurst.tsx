import { motion, AnimatePresence } from 'motion/react';

export interface BurstEvent {
  id: number;
  x: number;
  y: number;
  colorIndex: number;
}

interface ParticleBurstProps {
  bursts: BurstEvent[];
}

const PARTICLE_COLORS = ['#E85D3F', '#0F5E63', '#F59E0B', '#38BDF8'];

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function ParticleBurst({ bursts }: ParticleBurstProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden="true">
      <AnimatePresence>
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="absolute"
            style={{
              left: `${burst.x}px`,
              top: `${burst.y}px`,
            }}
          >
            {/* Expanding ripple ring */}
            <motion.span
              initial={{ scale: 0.3, opacity: 0.75 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-[#E85D3F]/50"
            />

            {/* Radial splash droplets */}
            {PARTICLE_ANGLES.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const distance = i % 2 === 0 ? 44 : 28;
              const tx = Math.cos(rad) * distance;
              const ty = Math.sin(rad) * distance;
              const color = PARTICLE_COLORS[(burst.colorIndex + i) % PARTICLE_COLORS.length];

              return (
                <motion.span
                  key={angle}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: tx,
                    y: ty,
                    scale: 0.2,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: i % 2 === 0 ? 7 : 5,
                    height: i % 2 === 0 ? 7 : 5,
                    backgroundColor: color,
                  }}
                />
              );
            })}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
