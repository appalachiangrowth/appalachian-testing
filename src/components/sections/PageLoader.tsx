'use client';

import { useState, useEffect, useSyncExternalStore, useCallback } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import Image from 'next/image';

const emptySubscribe = () => () => {};

export default function PageLoader() {
  const isLoaded = useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem('sc-loaded') === '1',
    () => false
  );
  const [dismissed, setDismissed] = useState(false);

  const hide = useCallback(() => {
    sessionStorage.setItem('sc-loaded', '1');
    setDismissed(true);
  }, []);

  useEffect(() => {
    if (isLoaded || dismissed) return;
    const timer = setTimeout(hide, 1800);
    return () => clearTimeout(timer);
  }, [isLoaded, dismissed, hide]);

  if (isLoaded || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
          key="page-loader"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
        >
          {/* Logo */}
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 8px rgba(182,255,0,0.2))',
                'drop-shadow(0 0 24px rgba(182,255,0,0.5))',
                'drop-shadow(0 0 8px rgba(182,255,0,0.2))',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-6"
          >
            <Image
              src="/appalachian-logo.png"
              alt="Appalachian Growth Solutions"
              width={722}
              height={176}
              priority
              unoptimized
              className="h-20 w-auto object-contain"
            />
          </motion.div>

          {/* Progress bar */}
          <div className="mx-auto mt-8 h-0.5 w-full max-w-xs overflow-hidden relative rounded-full bg-[#1A1A1A]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full rounded-full bg-[#B6FF00] relative overflow-hidden"
            >
              <span className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent' />
            </motion.div>
          </div>
      </motion.div>
    </AnimatePresence>
  );
}
