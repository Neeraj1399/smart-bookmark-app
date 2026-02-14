import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // Now createClient is async, so we await it
  const supabase = await createClient();

  // 1. Check if user is logged in
  // Always use getUser() on the server for security (it validates the session)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Initial Data Fetch (Server Side)
  // Fetching only bookmarks belonging to the logged-in user
  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id) // Ensure security by filtering by user_id
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error.message);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userEmail={user.email} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">My Bookmarks</h2>
          <p className="text-slate-600">
            Save and organize your favorite links.
          </p>
        </header>

        <section className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <BookmarkForm userId={user.id} />
          </div>

          <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
        </section>
      </main>
    </div>
  );
}
