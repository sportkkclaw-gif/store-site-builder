import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '店名片｜小店家的 AI 名片式網頁產生器',
  description: '30 分鐘建立你的店家線上名片，選模板、填資料、放菜單、加 LINE 與外送連結。',
  openGraph: {
    title: '店名片｜小店家的 AI 名片式網頁產生器',
    description: '可分享、可匯出、可代管的店家名片式網頁產生器。',
    type: 'website',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="zh-Hant"><body>{children}</body></html>; }
