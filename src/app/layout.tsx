import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ظ…ط³ط§ط± | ظ†ط¸ط§ظ… ط§ظ„ط·ط§ظ„ط¨ ط§ظ„ط±ظ‚ظ…ظٹ",
  description: "ظ†ط¸ط§ظ… ط§ظ„طھط´ط؛ظٹظ„ ط§ظ„ط±ظ‚ظ…ظٹ ظ„ط­ظٹط§طھظƒ ط§ظ„ط¬ط§ظ…ط¹ظٹط©",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ظ…ط³ط§ط±",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${ibmPlexSansArabic.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLanguage={locale}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      <script
  dangerouslySetInnerHTML={{
    __html: 
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        });
        caches.keys().then(function(names) {
          for (let name of names) caches.delete(name);
        });
      }
    
  }}
/>
      </body>
    </html>
  );
}

