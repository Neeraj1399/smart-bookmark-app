"use client";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

// --- Sub-Component: Bookmark Card ---
const BookmarkCard = ({
  bookmark,
  onDelete,
  onClick,
  isDeleting,
  setDeletingId,
}: {
  bookmark: any;
  onDelete: (id: string) => void;
  onClick: (id: string, clicks: number) => void;
  isDeleting: boolean;
  setDeletingId: (id: string | null) => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9, x: isDeleting ? 50 : 0 }}
    whileHover={{ rotateX: 1.5, rotateY: -1.5, y: -4 }}
    className="group relative bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/50 p-5 rounded-[2rem] flex items-center justify-between hover:shadow-2xl transition-all overflow-hidden"
  >
    <div
      className={`absolute left-0 top-0 bottom-0 w-1.5 ${bookmark.clicks > 15 ? "bg-amber-500" : "bg-blue-600"}`}
    />

    <div className="flex-1 min-w-0 pr-4 ml-2">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="font-black text-slate-900 dark:text-white truncate">
          {bookmark.title}
        </h3>
        <span className="text-[7px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md uppercase">
          {bookmark.category}
        </span>
      </div>
      <motion.a
        whileHover={{ x: 3 }}
        href={bookmark.url}
        target="_blank"
        onClick={() => onClick(bookmark.id, bookmark.clicks)}
        /* Added cursor-pointer */
        className="text-[11px] font-bold text-blue-500 dark:text-blue-400/80 flex items-center gap-1.5 cursor-pointer"
      >
        {bookmark.url.replace(/^https?:\/\//, "")}
        <ExternalLinkIcon />
      </motion.a>
    </div>

    <div className="flex items-center gap-6">
      <div className="text-right hidden sm:block">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
          Engagements
        </p>
        <motion.p
          key={bookmark.clicks}
          initial={{ scale: 1.4, color: "#3b82f6" }}
          animate={{ scale: 1, color: "inherit" }}
          className="text-lg font-black leading-none mt-1 text-slate-900 dark:text-white"
        >
          {bookmark.clicks || 0}
        </motion.p>
      </div>

      <div className="relative min-w-[44px] flex justify-end">
        <AnimatePresence mode="wait">
          {isDeleting ? (
            <motion.button
              key="confirm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onDelete(bookmark.id)}
              /* Added cursor-pointer */
              className="bg-red-500 text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg shadow-red-500/20 animate-shake cursor-pointer"
            >
              Delete?
            </motion.button>
          ) : (
            <motion.button
              key="delete"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
              }}
              onClick={() => setDeletingId(bookmark.id)}
              /* Added cursor-pointer */
              className="p-3 text-slate-300 dark:text-slate-600 rounded-2xl transition-all cursor-pointer"
            >
              <TrashIcon />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

// --- Main Component ---
export default function BookmarkList({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: any[];
  userId: string;
}) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) =>
              prev.some((b) => b.id === payload.new.id)
                ? prev
                : [payload.new, ...prev],
            );
          } else if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b)),
            );
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const handleBookmarkClick = async (id: string, currentClicks: number) => {
    const nextCount = (currentClicks || 0) + 1;
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, clicks: nextCount } : b)),
    );
    const { error } = await supabase
      .from("bookmarks")
      .update({ clicks: nextCount })
      .eq("id", id);
    if (error) {
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, clicks: currentClicks } : b)),
      );
    }
  };

  const deleteBookmark = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    await supabase.from("bookmarks").delete().eq("id", id);
    setDeletingId(null);
  };

  const filteredBookmarks = useMemo(() => {
    let list = [...bookmarks];
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.url.toLowerCase().includes(term),
      );
    }
    if (selectedCategory !== "All") {
      list = list.filter((b) => b.category === selectedCategory);
    }
    const sortMap: Record<string, (a: any, b: any) => number> = {
      title: (a, b) => a.title.localeCompare(b.title),
      most_visited: (a, b) => (b.clicks || 0) - (a.clicks || 0),
      newest: (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    };
    return list.sort(sortMap[sortBy] || sortMap.newest);
  }, [bookmarks, debouncedSearch, sortBy, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4 perspective-1000">
      <header className="flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-black tracking-tight text-slate-600 dark:text-slate-400 font-medium transition-colors">
            Library
          </h2>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-2">
            Personal Archive
          </p>
        </motion.div>
      </header>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Work", "Study", "Entertainment", "Personal"].map((cat) => (
            <CategoryButton
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-3xl outline-none focus:border-blue-500 transition-all font-bold text-sm text-slate-900 dark:text-white"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />

            {/* --- Bonus: Clear Search Button --- */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          <SelectControl value={dateFilter} onChange={setDateFilter}>
            <option value="all">Any Time</option>
            <option value="today">Today</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </SelectControl>

          <SelectControl value={sortBy} onChange={setSortBy}>
            <option value="newest">Latest</option>
            <option value="most_visited">Popular</option>
            <option value="title">A-Z</option>
          </SelectControl>
        </div>
      </div>

      <motion.div layout className="grid gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredBookmarks.length > 0 ? (
            filteredBookmarks.map((b) => (
              <BookmarkCard
                key={b.id}
                bookmark={b}
                isDeleting={deletingId === b.id}
                setDeletingId={setDeletingId}
                onDelete={deleteBookmark}
                onClick={handleBookmarkClick}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] animate-float"
            >
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                No bookmarks found
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// --- Helper UI Components ---
const CategoryButton = ({ label, active, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    /* Added cursor-pointer */
    className={`px-5 py-2 text-[10px] font-black rounded-full transition-all cursor-pointer ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
    }`}
  >
    {label}
  </motion.button>
);

const SelectControl = ({ value, onChange, children }: any) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    /* Added cursor-pointer */
    className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-3xl px-4 py-4 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-blue-500 transition-colors text-slate-900 dark:text-white"
  >
    {children}
  </select>
);

// --- Icons ---

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
