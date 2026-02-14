"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../lib/supabase/useTheme";

interface NavbarProps {
  userEmail: string | undefined;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const { isDarkMode, isAuto, mounted, toggleTheme, resetToAuto } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Section - Hand Icon added via cursor-pointer */}
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 15, rotateX: -5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 cursor-pointer group"
          style={{ perspective: "1000px" }}
          onClick={() => router.push("/dashboard")}
        >
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
            <motion.svg
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </motion.svg>
          </div>
          <h1 className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase hidden sm:block">
            Smart{" "}
            <span className="text-blue-600 dark:text-blue-400">Bookmarks</span>
          </h1>
        </motion.div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle - Added cursor-pointer */}
          <div className="min-w-[45px] sm:min-w-[90px] flex justify-end">
            {mounted ? (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                onContextMenu={(e) => {
                  e.preventDefault();
                  resetToAuto();
                }}
                className={`p-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer ${
                  isAuto
                    ? "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDarkMode ? "dark" : "light"}
                    initial={{ y: 10, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -10, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDarkMode ? (
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                        />
                      </svg>
                    )}
                  </motion.div>
                </AnimatePresence>
                {isAuto && (
                  <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 hidden sm:block">
                    Auto
                  </span>
                )}
              </motion.button>
            ) : (
              <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            )}
          </div>

          {/* Profile Dropdown Trigger - Added cursor-pointer */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-inner">
                {userEmail?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 hidden sm:block">
                {userEmail?.split("@")[0]}
              </span>
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-64 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-2 origin-top-right backdrop-blur-3xl"
                >
                  <div className="p-4 border-b border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Account
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {userEmail}
                    </p>
                  </div>
                  <div className="p-1">
                    {/* Logout Button - Added cursor-pointer */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 p-3 text-sm font-bold text-red-500 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
