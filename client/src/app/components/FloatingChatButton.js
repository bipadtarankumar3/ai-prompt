'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingChatButton() {
  const pathname = usePathname();
  
  // Hide on generator, login, and admin pages
  if (pathname === '/generator' || pathname === '/login' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        className="fixed bottom-6 right-6 z-[90]"
      >
        <Link 
          href="/generator"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 group"
          title="Open AI Generator"
        >
          <MessageSquarePlus size={24} className="group-hover:animate-pulse" />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
