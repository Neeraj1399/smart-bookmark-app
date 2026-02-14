"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar({
  userEmail,
}: {
  userEmail: string | undefined;
}) {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
            <svg
              className="w-5 h-5 text-white"
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
          <h1 className="font-extrabold text-xl tracking-tight text-slate-900">
            Smart<span className="text-blue-600">Bookmark</span>
          </h1>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Account
            </span>
            <span className="text-sm font-medium text-slate-700">
              {userEmail}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-red-600 transition-all active:scale-95"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
