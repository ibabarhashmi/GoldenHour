import type { Metadata } from "next";
import { Anek_Devanagari, Anek_Latin, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "../components/chrome";

// Anek is a metrically matched Indic superfamily: the Hindi toggle must not
// reflow the page. IBM Plex Mono carries timers and reference numbers.
const anekLatin = Anek_Latin({
  subsets: ["latin"],
  variable: "--font-anek-latin",
  display: "swap",
});

const anekDeva = Anek_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-anek-deva",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoldenHour — first response for cyber fraud",
  description:
    "A calm screen for the worst fifteen minutes: a live golden-hour countdown and three ordered actions — call 1930, freeze with your bank, file on NCRP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anekLatin.variable} ${anekDeva.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-ui">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
