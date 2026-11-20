import "./globals.css";

// The <html> and <body> tags live in app/[locale]/layout.tsx (public site)
// and app/admin/layout.tsx (admin), so each can set its own `lang`.
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
