"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

const CATEGORIES = ["General", "Work", "Study", "Entertainment", "Personal"];
const LIMITS = { TITLE: 60, URL: 255 };

export default function BookmarkForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ title: false, url: false });
  const [errorState, setErrorState] = useState(false);

  const supabase = createClient();

  const handleSuccess = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: Math.random() * (0.3 - 0.1) + 0.1,
          y: Math.random() - 0.2,
        },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: Math.random() * (0.9 - 0.7) + 0.7,
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  };

  const triggerError = (newErrors: { title: boolean; url: boolean }) => {
    setErrors(newErrors);
    setErrorState(true);
    setTimeout(() => setErrorState(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isTitleEmpty = !title.trim() || title.length > LIMITS.TITLE;
    const isUrlEmpty = !url.trim() || url.length > LIMITS.URL;

    if (isTitleEmpty || isUrlEmpty) {
      triggerError({ title: isTitleEmpty, url: isUrlEmpty });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("bookmarks").insert([
      {
        url: url.toLowerCase().trim().startsWith("http")
          ? url
          : `https://${url}`,
        title: title.trim(),
        category,
        user_id: userId,
      },
    ]);

    if (!error) {
      handleSuccess();
      setUrl("");
      setTitle("");
      setCategory("General");
      router.refresh();
    } else {
      triggerError({ title: false, url: true });
    }
    setLoading(false);
  };

  return (
    <section className="w-full max-w-6xl mx-auto mb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ rotateX: 1, rotateY: -1, scale: 1.002 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ perspective: "1200px" }}
      >
        <form
          onSubmit={handleSubmit}
          className={`group relative bg-white dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl 
            ${errorState ? "animate-shake border-red-500 shadow-red-500/10" : "border-slate-200 dark:border-slate-800"}`}
        >
          {/* Floating Icon */}
          <motion.div
            className="absolute -top-6 left-8 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: -15 }}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors
              ${errorState ? "bg-red-500" : "bg-blue-600 group-focus-within:bg-indigo-600 shadow-blue-500/20"}`}
            >
              <svg
                className="w-7 h-7 text-white"
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
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 mb-8">
            {/* Title Input */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <label
                  className={`text-[10px] font-black uppercase tracking-[0.2em] ${errors.title ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`}
                >
                  Title
                </label>
                <span
                  className={`text-[9px] font-bold ${title.length >= LIMITS.TITLE ? "text-red-500" : "text-slate-400"}`}
                >
                  {title.length}/{LIMITS.TITLE}
                </span>
              </div>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                maxLength={LIMITS.TITLE}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Next.js Documentation"
                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border rounded-2xl outline-none transition-all text-slate-800 dark:text-slate-100 cursor-text
                  ${errors.title ? "border-red-500 ring-4 ring-red-500/10" : "border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"}`}
              />
            </div>

            {/* URL Input */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <label
                  className={`text-[10px] font-black uppercase tracking-[0.2em] ${errors.url ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`}
                >
                  URL
                </label>
                <span
                  className={`text-[9px] font-bold ${url.length >= LIMITS.URL ? "text-red-500" : "text-slate-400"}`}
                >
                  {url.length}/{LIMITS.URL}
                </span>
              </div>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                maxLength={LIMITS.URL}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="nextjs.org/docs"
                className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border rounded-2xl outline-none transition-all text-slate-800 dark:text-slate-100 cursor-text
                  ${errors.url ? "border-red-500 ring-4 ring-red-500/10" : "border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"}`}
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">
                Category
              </label>
              <div className="relative group/select">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 outline-none transition-all text-slate-800 dark:text-slate-100 appearance-none cursor-pointer font-bold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="dark:bg-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 transition-transform group-focus-within/select:rotate-180">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01, translateY: -2 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className={`w-full font-black text-xs uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer
              ${errorState ? "bg-red-500 text-white" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25"}`}
          >
            {loading
              ? "Saving..."
              : errorState
                ? "Check Fields"
                : "Save Bookmark"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
