import Link from 'next/link';
import { HostingRequestButton } from '@/components/hosting/HostingRequestModal';

const sections = [
  ['什麼是代管發布', '店名片協助你處理公開網址、SSL、網站空間與發布流程。'],
  ['適合誰', '適合不想處理架站、DNS、SSL 或靜態主機設定的小店家。'],
  ['你需要提供什麼', '店家資料、菜單、圖片、聯絡方式，以及想使用的網址名稱。'],
  ['我們會協助什麼', '確認資料、產出靜態網站、部署、檢查手機版與回傳公開網址。'],
  ['子網域示意', '例如 https://my-tea-shop.denmeipian.app，目前只是示意，不會真的部署。'],
  ['自訂網域示意', '若你已有網域，可在申請中標示，後續人工協助 DNS 設定。'],
];
const faqs = [
  ['我不會架站', '建議選擇店名片代管發布。'],
  ['我想自己上傳', '建議下載 ZIP，參考自行部署教學。'],
  ['我的圖片看起來怪', '建議回圖片媒體重新上傳或更換 Hero 圖。'],
  ['我沒有網域', '建議先使用店名片代管子網域。'],
  ['我有自己的網域', '建議申請自訂網域代管，後續協助 DNS 設定。'],
  ['我只是想放 LINE / IG', '建議使用店名片名片式網頁即可，不需要完整電商。'],
];

export default function ManagedHostingPage() {
  return <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 to-teal-50 px-4 py-10 text-slate-900 sm:px-6"><div className="mx-auto grid max-w-6xl gap-6"><section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"><p className="text-xs font-black uppercase tracking-[0.24em] text-teal-600">Managed Hosting</p><h1 className="mt-3 text-3xl font-black md:text-5xl">店名片代管發布</h1><p className="mt-4 max-w-3xl text-base font-bold leading-7 text-slate-600">不會架站也沒關係。店名片可以協助你處理公開網址、SSL、網站空間與發布流程。你只需要填好店家資料、菜單、圖片與聯絡方式。</p><div className="mt-6 flex flex-wrap gap-3"><HostingRequestButton>申請代管發布</HostingRequestButton><Link href="/deploy-guide" className="rounded-full bg-slate-100 px-7 py-4 text-center font-black text-slate-700">我想自行部署</Link></div></section><section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{sections.map(([title, body]) => <article key={title} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-xl font-black">{title}</h2><p className="mt-3 text-sm font-bold leading-6 text-slate-600">{body}</p></article>)}</section><section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-2xl font-black">常見問題 / 問題診斷</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{faqs.map(([q, a]) => <details key={q} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><summary className="cursor-pointer font-black text-slate-900">{q}</summary><p className="mt-2 text-sm font-bold leading-6 text-slate-600">{a}</p></details>)}</div></section><section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-sm sm:p-8"><h2 className="text-2xl font-black">準備好了嗎？</h2><p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-300">先在 Builder 補齊資料，或直接產生代管申請 JSON；本版只做申請資料包，不做真正雲端部署。</p><div className="mt-5"><HostingRequestButton className="rounded-full bg-teal-400 px-7 py-4 text-center font-black text-slate-950 shadow-lg shadow-teal-900/20">申請代管發布</HostingRequestButton></div></section></div></main>;
}
