import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '店名片｜小店家的 AI 名片式網頁產生器',
  description: '透過 5 步導引、推薦模板、發布前檢查與代管發布申請，快速建立小店家的名片式網站。',
  openGraph: {
    title: '店名片｜小店家的 AI 名片式網頁產生器',
    description: '不用登入、資料庫或金流，也能先建立可匯出的 AI 名片式網站。',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
