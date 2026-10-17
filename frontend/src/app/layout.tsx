import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Kids English Tutor | Fun Progressive Learning (<7 Years)",
  description:
    "AI-Powered English Learning Chatbot for Children under 7 years old with progressive learning (L1-L3), Child Mode detection, Social Emotional Learning (SEL), and sub-2s response latency.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐻</text></svg>",
  },
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-amber-200 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
