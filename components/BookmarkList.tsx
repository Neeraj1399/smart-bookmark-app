// // "use client";
// // import { useEffect, useState, useMemo } from "react";
// // import { createClient } from "@/lib/supabase/client";
// // import { useRouter } from "next/navigation";

// // export default function BookmarkList({
// //   initialBookmarks,
// //   userId,
// // }: {
// //   initialBookmarks: any[];
// //   userId: string;
// // }) {
// //   const router = useRouter();
// //   const [bookmarks, setBookmarks] = useState(initialBookmarks);
// //   const [sortBy, setSortBy] = useState("title"); // Defaulting to Alphabetical
// //   const supabase = createClient();

// //   // 1. Sync with server-side data (Handles Same-Tab updates)
// //   useEffect(() => {
// //     setBookmarks(initialBookmarks);
// //   }, [initialBookmarks]);

// //   // 2. Realtime Listener (Handles Other-Tab updates)
// //   useEffect(() => {
// //     const channel = supabase
// //       .channel("realtime-bookmarks")
// //       .on(
// //         "postgres_changes",
// //         {
// //           event: "*",
// //           schema: "public",
// //           table: "bookmarks",
// //           filter: `user_id=eq.${userId}`,
// //         },
// //         (payload) => {
// //           if (payload.eventType === "INSERT") {
// //             setBookmarks((prev) => {
// //               // Duplicate check
// //               if (prev.find((b) => b.id === payload.new.id)) return prev;
// //               return [payload.new, ...prev];
// //             });
// //           } else if (payload.eventType === "DELETE") {
// //             const deletedId = payload.old?.id;
// //             if (deletedId) {
// //               setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
// //             } else {
// //               // Fallback if REPLICA IDENTITY is not set to FULL yet
// //               router.refresh();
// //             }
// //           }
// //         },
// //       )
// //       .subscribe();

// //     return () => {
// //       supabase.removeChannel(channel);
// //     };
// //   }, [supabase, userId, router]);

// //   // 3. Sorting Logic - Computed via useMemo for performance
// //   const sortedBookmarks = useMemo(() => {
// //     const list = [...bookmarks];
// //     if (sortBy === "title") {
// //       return list.sort((a, b) => a.title.localeCompare(b.title));
// //     }
// //     if (sortBy === "oldest") {
// //       return list.sort(
// //         (a, b) =>
// //           new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
// //       );
// //     }
// //     // Default: Newest
// //     return list.sort(
// //       (a, b) =>
// //         new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
// //     );
// //   }, [bookmarks, sortBy]);

// //   // 4. Delete Function with Optimistic UI
// //   const deleteBookmark = async (id: string) => {
// //     setBookmarks((prev) => prev.filter((b) => b.id !== id));
// //     const { error } = await supabase.from("bookmarks").delete().eq("id", id);

// //     if (error) {
// //       alert("Could not delete bookmark.");
// //       router.refresh(); // Rollback UI if delete failed
// //     } else {
// //       router.refresh();
// //     }
// //   };

// //   if (bookmarks.length === 0) {
// //     return (
// //       <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
// //         <p className="text-slate-500 font-medium">
// //           No bookmarks found. Add your first one above!
// //         </p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-4">
// //       {/* Sort Controls */}
// //       <div className="flex justify-between items-center px-1">
// //         <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
// //           Your Collection ({bookmarks.length})
// //         </h2>
// //         <div className="flex items-center gap-2">
// //           <label className="text-xs font-semibold text-slate-400">
// //             SORT BY
// //           </label>
// //           <select
// //             value={sortBy}
// //             onChange={(e) => setSortBy(e.target.value)}
// //             className="text-sm bg-transparent border-none focus:ring-0 font-bold text-slate-700 cursor-pointer"
// //           >
// //             <option value="title">Title (A-Z)</option>
// //             <option value="newest">Newest First</option>
// //             <option value="oldest">Oldest First</option>
// //           </select>
// //         </div>
// //       </div>

// //       <div className="grid gap-3">
// //         {sortedBookmarks.map((b) => (
// //           <div
// //             key={b.id}
// //             className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-200"
// //           >
// //             <div className="flex flex-col min-w-0 pr-4">
// //               <h3 className="font-semibold text-slate-800 truncate">
// //                 {b.title}
// //               </h3>
// //               <a
// //                 href={b.url}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="text-sm text-blue-500 hover:underline truncate opacity-80"
// //               >
// //                 {b.url}
// //               </a>
// //             </div>

// //             <button
// //               onClick={() => deleteBookmark(b.id)}
// //               className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all transform hover:scale-105"
// //             >
// //               DELETE
// //             </button>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
// "use client";
// import { useEffect, useState, useMemo } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";

// export default function BookmarkList({
//   initialBookmarks,
//   userId,
// }: {
//   initialBookmarks: any[];
//   userId: string;
// }) {
//   const router = useRouter();
//   const [bookmarks, setBookmarks] = useState(initialBookmarks);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("title");
//   const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'week'
//   const supabase = createClient();

//   useEffect(() => {
//     setBookmarks(initialBookmarks);
//   }, [initialBookmarks]);

//   useEffect(() => {
//     const channel = supabase
//       .channel("realtime-bookmarks")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "bookmarks",
//           filter: `user_id=eq.${userId}`,
//         },
//         (payload) => {
//           if (payload.eventType === "INSERT") {
//             setBookmarks((prev) => {
//               if (prev.find((b) => b.id === payload.new.id)) return prev;
//               return [payload.new, ...prev];
//             });
//           } else if (payload.eventType === "DELETE") {
//             const deletedId = payload.old?.id;
//             if (deletedId) {
//               setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
//             } else {
//               router.refresh();
//             }
//           }
//         },
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [supabase, userId, router]);

//   // Combined Filter and Sort Logic
//   const filteredAndSortedBookmarks = useMemo(() => {
//     let list = [...bookmarks];

//     // 1. Search Filter
//     if (searchTerm) {
//       list = list.filter(
//         (b) =>
//           b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           b.url.toLowerCase().includes(searchTerm.toLowerCase()),
//       );
//     }

//     // 2. Date Filter
//     const now = new Date();
//     if (dateFilter === "today") {
//       list = list.filter((b) => {
//         const d = new Date(b.created_at);
//         return d.toDateString() === now.toDateString();
//       });
//     } else if (dateFilter === "week") {
//       const oneWeekAgo = new Date();
//       oneWeekAgo.setDate(now.getDate() - 7);
//       list = list.filter((b) => new Date(b.created_at) >= oneWeekAgo);
//     }

//     // 3. Sorting
//     if (sortBy === "title") {
//       list.sort((a, b) => a.title.localeCompare(b.title));
//     } else if (sortBy === "oldest") {
//       list.sort(
//         (a, b) =>
//           new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
//       );
//     } else {
//       list.sort(
//         (a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
//       );
//     }

//     return list;
//   }, [bookmarks, searchTerm, sortBy, dateFilter]);

//   const deleteBookmark = async (id: string) => {
//     setBookmarks((prev) => prev.filter((b) => b.id !== id));
//     const { error } = await supabase.from("bookmarks").delete().eq("id", id);
//     if (error) router.refresh();
//     else router.refresh();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Search and Filters Bar */}
//       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search title or URL..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
//           />
//           <svg
//             className="absolute left-3 top-3 h-5 w-5 text-slate-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         </div>

//         <div className="flex flex-wrap items-center gap-4 text-sm">
//           <div className="flex items-center gap-2">
//             <span className="font-bold text-slate-400 uppercase text-[10px]">
//               Date Range
//             </span>
//             <div className="flex bg-slate-200 p-1 rounded-lg">
//               {["all", "today", "week"].map((f) => (
//                 <button
//                   key={f}
//                   onClick={() => setDateFilter(f)}
//                   className={`px-3 py-1 rounded-md capitalize transition-all ${
//                     dateFilter === f
//                       ? "bg-white text-blue-600 shadow-sm font-bold"
//                       : "text-slate-600 hover:text-slate-800"
//                   }`}
//                 >
//                   {f}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 ml-auto">
//             <span className="font-bold text-slate-400 uppercase text-[10px]">
//               Sort
//             </span>
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="bg-transparent border-none focus:ring-0 font-bold text-slate-700 cursor-pointer text-sm"
//             >
//               <option value="title">A-Z</option>
//               <option value="newest">Newest</option>
//               <option value="oldest">Oldest</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Results Count */}
//       <div className="px-1 text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
//         <span>Showing {filteredAndSortedBookmarks.length} Bookmarks</span>
//         {searchTerm && <span>Filtered by "{searchTerm}"</span>}
//       </div>

//       {/* List */}
//       <div className="grid gap-3">
//         {filteredAndSortedBookmarks.length > 0 ? (
//           filteredAndSortedBookmarks.map((b) => (
//             <div
//               key={b.id}
//               className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
//             >
//               <div className="flex flex-col min-w-0 pr-4">
//                 <h3 className="font-semibold text-slate-800 truncate">
//                   {b.title}
//                 </h3>
//                 <a
//                   href={b.url}
//                   target="_blank"
//                   className="text-sm text-blue-500 truncate opacity-80"
//                 >
//                   {b.url}
//                 </a>
//               </div>
//               <button
//                 onClick={() => deleteBookmark(b.id)}
//                 className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
//               >
//                 DELETE
//               </button>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-10 text-slate-400 italic">
//             No matches found for your criteria.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function BookmarkList({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: any[];
  userId: string;
}) {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState(initialBookmarks);

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const supabase = createClient();

  // 1. Sync with server data
  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  // 2. Realtime Listener
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
            setBookmarks((prev) => {
              if (prev.find((b) => b.id === payload.new.id)) return prev;
              return [payload.new, ...prev];
            });
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
            } else {
              router.refresh();
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, router]);

  // 3. The "Brain": Combined Filter and Sort Logic
  const filteredAndSortedBookmarks = useMemo(() => {
    let list = [...bookmarks];

    // Search Filter (Title & URL)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.url.toLowerCase().includes(term),
      );
    }

    // Category Filter
    if (selectedCategory !== "All") {
      list = list.filter((b) => b.category === selectedCategory);
    }

    // Date Filter
    const now = new Date();
    if (dateFilter === "today") {
      list = list.filter((b) => {
        const d = new Date(b.created_at);
        return d.toDateString() === now.toDateString();
      });
    } else if (dateFilter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      list = list.filter((b) => new Date(b.created_at) >= oneWeekAgo);
    }

    // Sorting
    if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    } else {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return list;
  }, [bookmarks, searchTerm, sortBy, dateFilter, selectedCategory]);

  const deleteBookmark = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Dashboard */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5 shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search your bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter w-16">
              Category
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "General",
                "Work",
                "Study",
                "Entertainment",
                "Personal",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
            {/* Date Range Select */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Date
              </span>
              <div className="flex bg-slate-200 p-1 rounded-lg">
                {["all", "today", "week"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setDateFilter(f)}
                    className={`px-3 py-1 text-xs rounded-md capitalize transition-all ${
                      dateFilter === f
                        ? "bg-white text-blue-600 shadow-sm font-bold"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-bold text-slate-700 cursor-pointer text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-1 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <span>Collection / {filteredAndSortedBookmarks.length} Items</span>
        {searchTerm && <span>Search: "{searchTerm}"</span>}
      </div>

      {/* List Rendering */}
      <div className="grid gap-3">
        {filteredAndSortedBookmarks.length > 0 ? (
          filteredAndSortedBookmarks.map((b) => (
            <div
              key={b.id}
              className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex flex-col min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-slate-800 truncate">
                    {b.title}
                  </h3>
                  <span className="flex-shrink-0 px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded uppercase">
                    {b.category || "General"}
                  </span>
                </div>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline truncate opacity-70"
                >
                  {b.url}
                </a>
              </div>
              <button
                onClick={() => deleteBookmark(b.id)}
                className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-[10px] font-black text-red-500 bg-red-50 rounded-lg hover:bg-red-500 hover:text-white transition-all transform active:scale-95"
              >
                DELETE
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium">
              No bookmarks found matching those filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
