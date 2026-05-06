import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'StoreSite Builder', description: '30 分鐘建立小店家官方網站' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="zh-Hant"><body>{children}</body></html>; }
