// "use client";
// import { useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";

// export default function BookmarkForm({ userId }: { userId: string }) {
//   const router = useRouter();
//   const [url, setUrl] = useState("");
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(false);
//   const supabase = createClient();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await supabase
//       .from("bookmarks")
//       .insert([{ url, title, user_id: userId }]);

//     if (!error) {
//       setUrl("");
//       setTitle("");
//       router.refresh();
//     } else {
//       // Handle Database Unique Constraint Error
//       if (error.code === "23505") {
//         alert("You have already bookmarked this URL.");
//       } else {
//         alert("Error adding bookmark. Please try again.");
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <section className="max-w-2xl mx-auto mb-10">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div className="space-y-1">
//             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
//               Title
//             </label>
//             <input
//               type="text"
//               placeholder="e.g. GitHub Repository"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-800"
//             />
//           </div>

//           <div className="space-y-1">
//             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
//               URL
//             </label>
//             <input
//               type="url"
//               placeholder="https://..."
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               required
//               className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-800"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 active:scale-[0.98] disabled:bg-slate-300 transition-all shadow-sm"
//         >
//           {loading ? "Saving..." : "Add to Bookmarks"}
//         </button>
//       </form>
//     </section>
//   );
// }
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function BookmarkForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General"); // New State
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("bookmarks")
      .insert([{ url, title, category, user_id: userId }]); // Added category to insert

    if (!error) {
      setUrl("");
      setTitle("");
      setCategory("General");
      router.refresh();
    } else {
      if (error.code === "23505") {
        alert("You have already bookmarked this URL.");
      } else {
        alert("Error adding bookmark. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <section className="max-w-2xl mx-auto mb-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. GitHub Repository"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-800"
            />
          </div>

          {/* URL Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
              URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-800"
            />
          </div>

          {/* Category Dropdown (Spans 2 columns) */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-800 cursor-pointer"
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 active:scale-[0.98] disabled:bg-slate-300 transition-all shadow-sm"
        >
          {loading ? "Saving..." : "Add to Bookmarks"}
        </button>
      </form>
    </section>
  );
}
