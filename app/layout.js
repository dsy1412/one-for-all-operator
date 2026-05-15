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
  title: "数学定理可视化汇总馆",
  description:
    "用可视化、逻辑步骤和新手友好的例子理解泰勒公式、平方根迭代、夹逼定理与 EML 单一算子。",
  keywords: [
    "数学可视化",
    "泰勒公式",
    "EML",
    "平方根",
    "夹逼定理",
    "牛顿迭代",
    "数学教育",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body style={{ margin: 0 }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
