"use client";
import { useState } from "react"; // Added useState
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function LoginPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false); // New state

  const handleLogin = async () => {
    setIsLoading(true); // Start loading
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="p-8 md:p-12 bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <svg
              className="w-8 h-8 text-white"
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
            </svg>
          </motion.div>

          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase mb-2">
            Smart Bookmark
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
            The ultimate vault for your digital discoveries. <br /> Secure.
            Fast. Realtime.
          </p>

          <motion.button
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            onClick={handleLogin}
            disabled={isLoading}
            className={`group w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl transition-all shadow-sm cursor-pointer ${isLoading ? "opacity-70 cursor-wait" : "hover:bg-slate-50 dark:hover:bg-slate-700"}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <img
                src="https://www.google.com/favicon.ico"
                className="w-5 h-5 group-hover:rotate-12 transition-transform"
                alt="Google"
              />
            )}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {isLoading ? "Connecting..." : "Continue with Google"}
            </span>
          </motion.button>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Powered by Supabase & Next.js
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
