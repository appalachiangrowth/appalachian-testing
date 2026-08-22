'use client'

import { useState, useCallback, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from '@/lib/motion'
import { Cookie } from 'lucide-react'

const emptySubscribe = () => () => {};

export default function CookieConsent() {
  const consent = useSyncExternalStore(
    emptySubscribe,
    () => localStorage.getItem('cookie-consent'),
    () => null
  );
  const [dismissed, setDismissed] = useState(false);

  const visible = consent === null && !dismissed;

  const handleAccept = useCallback(() => {
    localStorage.setItem('cookie-consent', 'accepted')
    setDismissed(true)
  }, [])

  const handleDecline = useCallback(() => {
    localStorage.setItem('cookie-consent', 'declined')
    setDismissed(true)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-[#111]/95 backdrop-blur-xl border-t border-[rgba(182,255,0,0.1)] pb-[env(safe-area-inset-bottom)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col items-center sm:items-center justify-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <Cookie className="w-4 h-4 text-[#B6FF00] opacity-80 shrink-0" />
              <p className="text-[#bbb] text-xs sm:text-sm leading-relaxed">
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleAccept}
                className="bg-[#B6FF00] text-[#050505] rounded-lg px-5 py-2.5 min-h-[44px] text-sm font-semibold hover:shadow-[0_0_20px_rgba(182,255,0,0.3)] transition-shadow duration-300 cursor-pointer"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="border border-[rgba(255,255,255,0.1)] text-[#999] rounded-lg px-5 py-2.5 min-h-[44px] text-sm hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
