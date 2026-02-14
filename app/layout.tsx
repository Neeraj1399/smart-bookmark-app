import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Smart Bookmark App",
  description: "A professional real-time bookmark manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const hour = new Date().getHours();
                  
                  // Define "Night" as 7 PM (19) to 6 AM (6)
                  const isNight = hour >= 19 || hour < 6;
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                  // Priority 1: User's manual selection (savedTheme)
                  // Priority 2: Automatic selection based on Time or System OS preference
                  if (
                    savedTheme === 'dark' || 
                    (savedTheme === null && (isNight || prefersDark))
                  ) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error("Theme initialization failed", e);
                }
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.className} transition-colors duration-500`}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
