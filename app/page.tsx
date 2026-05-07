import Link from 'next/link';

const templates = [
  { name: '清新日系', desc: '米白留白、抹茶綠、柔和卡片', bg: 'from-teal-50 to-amber-50', accent: '#14B8A6' },
  { name: '質感極簡', desc: '炭黑標題、咖啡棕、大圖排版', bg: 'from-stone-900 to-stone-700', accent: '#A16207' },
  { name: '活潑可愛', desc: '珊瑚、黃色、薄荷綠、促銷感', bg: 'from-orange-100 to-yellow-100', accent: '#F97316' },
];
const features = ['欄位式建站', '即時預覽', '菜單管理', '圖片上傳', 'SEO 設定', '靜態網站 ZIP 匯出'];
const targets = ['飲料店', '餐飲店', '咖啡廳', '小吃店', '小型品牌'];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_35%),linear-gradient(180deg,#f8fafc,#eef2f7)] text-slate-950">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-500 font-black text-white shadow-lg shadow-teal-500/30">S</span><b>StoreSite Builder</b></div>
        <Link href="/builder" className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:ring-teal-300">開啟 Builder</Link>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-[1.05fr_.95fr] md:px-8 md:py-20">
        <div>
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-teal-600 shadow-sm ring-1 ring-teal-100">StoreSite Builder</span>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">30 分鐘建立小店家官方網站</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">輸入店家資料、菜單、圖片與連結，即時產生可部署的靜態網站。適合想快速擁有品牌官網的小店家。</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/builder" className="rounded-full bg-teal-500 px-8 py-4 text-center font-black text-white shadow-xl shadow-teal-500/25 transition hover:bg-teal-600">開始建立網站</Link><a href="#templates" className="rounded-full bg-white px-8 py-4 text-center font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:ring-teal-300">查看模板方向</a></div>
        </div>
        <div className="relative rounded-[2rem] bg-white p-4 shadow-2xl shadow-slate-300/50 ring-1 ring-slate-200">
          <div className="flex gap-2 border-b border-slate-100 pb-3"><span className="h-3 w-3 rounded-full bg-red-400"/><span className="h-3 w-3 rounded-full bg-amber-400"/><span className="h-3 w-3 rounded-full bg-emerald-400"/></div>
          <div className="mt-4 rounded-[1.5rem] bg-gradient-to-br from-teal-50 via-white to-amber-50 p-6">
            <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-teal-700">日沐茶飲</div>
            <h2 className="mt-8 text-4xl font-black">每天一杯，日常更美好</h2>
            <p className="mt-3 text-slate-600">手作現調・茶飲・外送訂購</p>
            <div className="mt-8 grid grid-cols-3 gap-3">{['珍奶', '紅茶拿鐵', '檸檬青'].map((x, i) => <div key={x} className="rounded-3xl bg-white p-4 shadow-sm"><div className={`mb-3 h-16 rounded-2xl ${i === 1 ? 'bg-amber-100' : 'bg-teal-100'}`} /><b>{x}</b><p className="text-sm text-teal-600">$60</p></div>)}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8"><div className="grid gap-4 md:grid-cols-3">{['填寫店家資料', '選擇模板風格', '預覽並匯出網站'].map((step, i) => <div key={step} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 font-black text-teal-600">0{i + 1}</span><h3 className="mt-4 text-xl font-black">{step}</h3><p className="mt-2 text-sm leading-6 text-slate-500">以欄位式流程完成內容，不需要懂設計或程式。</p></div>)}</div></section>

      <section id="templates" className="mx-auto max-w-7xl px-5 py-12 md:px-8"><div className="mb-8"><p className="text-sm font-black uppercase tracking-[0.24em] text-teal-500">Templates</p><h2 className="mt-2 text-3xl font-black">三種可商用模板方向</h2></div><div className="grid gap-5 md:grid-cols-3">{templates.map(t => <div key={t.name} className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-200"><div className={`h-44 rounded-[1.5rem] bg-gradient-to-br ${t.bg} p-4 ${t.name === '質感極簡' ? 'text-white' : 'text-slate-900'}`}><div className="h-8 w-24 rounded-full bg-white/70"/><div className="mt-10 h-5 w-3/4 rounded-full bg-current opacity-70"/><div className="mt-3 h-3 w-1/2 rounded-full bg-current opacity-30"/><div className="mt-6 grid grid-cols-3 gap-2">{[1,2,3].map(i=><span key={i} className="h-10 rounded-xl bg-white/60"/>)}</div></div><h3 className="mt-5 text-xl font-black">{t.name}</h3><p className="mt-1 text-sm text-slate-500">{t.desc}</p></div>)}</div></section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8"><div className="rounded-[2.5rem] bg-slate-950 p-8 text-white md:p-10"><h2 className="text-3xl font-black">功能特色</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{features.map(f => <div key={f} className="rounded-3xl bg-white/10 p-5 font-bold ring-1 ring-white/10">✓ {f}</div>)}</div><div className="mt-8 flex flex-wrap gap-2">{targets.map(t => <span key={t} className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-900">{t}</span>)}</div></div></section>

      <footer className="mx-auto max-w-7xl px-5 py-10 text-sm text-slate-500 md:px-8">© 2026 StoreSite Builder. Built for small local brands.</footer>
    </main>
  );
}
