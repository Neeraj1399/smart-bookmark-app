import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error.message);
  }

  return (
    /* Removed bg-gray-50 to let RootLayout handle the background color */
    <div className="min-h-screen transition-colors duration-500">
      <Navbar userEmail={user.email} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-600 dark:text-slate-400 font-medium transition-colors">
            My{" "}
            <span className="text-blue-600 dark:text-blue-400">Bookmarks</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium transition-colors">
            Save and organize your favorite links.
          </p>
        </header>

        <section className="space-y-12">
          {/* Removed the wrapper div's white background. 
              The BookmarkForm component now handles its own dark/light styling.
          */}
          <BookmarkForm userId={user.id} />

          <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
        </section>
      </main>
    </div>
  );
}
