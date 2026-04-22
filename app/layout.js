import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "EML — Universal Function Generator via a Single Binary Operator",
  description:
    "Discover how all elementary functions — exponential, logarithmic, trigonometric, and algebraic — can be generated from a single binary operator: eml(x, y) = exp(x) - ln(y).",
  keywords: [
    "EML",
    "elementary functions",
    "functional completeness",
    "symbolic regression",
    "binary operator",
    "mathematical visualization",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body style={{ margin: 0 }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
