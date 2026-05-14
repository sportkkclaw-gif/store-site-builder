import Link from 'next/link';
import { OnboardingStartButton } from '@/components/onboarding/OnboardingWizard';
import { HostingRequestButton } from '@/components/hosting/HostingRequestModal';

const showcaseTemplates = [
  { name: '抹茶日和', industry: '飲料店', image: '/template-gallery-ai/drink-shop/drink-matcha-hiyori.png' },
  { name: '珍珠霓光', industry: '飲料店', image: '/template-gallery-ai/drink-shop/drink-boba-neon.png' },
  { name: '果香樂園', industry: '飲料店', image: '/template-gallery-ai/drink-shop/drink-fruit-paradise.png' },
  { name: '白桃氣泡', industry: '飲料店', image: '/template-gallery-ai/drink-shop/drink-white-peach-sparkle.png' },
  { name: '金色晚宴', industry: '餐飲店', image: '/template-gallery-ai/restaurant/restaurant-golden-banquet.png' },
  { name: '香辣市集', industry: '餐飲店', image: '/template-gallery-ai/restaurant/restaurant-spicy-market.png' },
  { name: '鍋物暖居', industry: '餐飲店', image: '/template-gallery-ai/restaurant/restaurant-hotpot-home.png' },
  { name: '炭火本味', industry: '餐飲店', image: '/template-gallery-ai/restaurant/restaurant-charcoal-essence.png' },
  { name: '白瓷濾杯', industry: '咖啡廳', image: '/template-gallery-ai/cafe/cafe-white-dripper.png' },
  { name: '城市黑白', industry: '咖啡廳', image: '/template-gallery-ai/cafe/cafe-urban-monochrome.png' },
  { name: '日常一隅', industry: '咖啡廳', image: '/template-gallery-ai/cafe/cafe-daily-corner.png' },
  { name: '午夜焙煎', industry: '咖啡廳', image: '/template-gallery-ai/cafe/cafe-midnight-roast.png' },
];

const workflow = [
  { step: '01', title: '選模板', desc: '從 30 套 AI 視覺模板挑選適合產業與品牌風格的方向。' },
  { step: '02', title: '填資料', desc: '填入店名、標語、菜單、LINE、地圖與外送連結。' },
  { step: '03', title: '預覽網站', desc: '即時檢查桌機與手機版名片式網頁。' },
  { step: '04', title: '匯出或代管', desc: '自行匯出 ZIP，或申請店名片協助代管發布。' },
];

const hostingPlans = [
  { title: '自行匯出', audience: '適合懂一點網站部署的人', price: '即將開放 / 洽詢', features: ['匯出 ZIP', '自行上傳主機', '自行管理網址'] },
  { title: '店名片代管', audience: '適合不想處理架站的小店家', price: '即將開放 / 洽詢', features: ['提供公開網址', 'SSL', '網站空間', '可重新發布', '基本維護'] },
  { title: '自訂網域代管', audience: '適合正式品牌', price: '即將開放 / 洽詢', features: ['綁定自己的網域', '協助 DNS', '移除品牌標示', '進階 SEO'] },
];

const faqs = [
  ['我不會架站怎麼辦？', '你可以選擇店名片代管發布，我們會協助處理公開網址、SSL 與網站空間。'],
  ['我可以自己上傳網站嗎？', '可以。匯出 ZIP 後，可以上傳到任何靜態網站主機。'],
  ['我可以之後修改嗎？', '可以。你可以匯出 JSON 備份，下次匯入後繼續修改。'],
  ['可以用自己的網域嗎？', '可以。後續代管方案會支援自訂網域與 DNS 設定協助。'],
  ['這是完整電商嗎？', '不是。店名片主要是名片式網頁，用來展示店家資訊、菜單、地圖、LINE 與外送連結。'],
];

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-black uppercase tracking-[0.28em] text-teal-600">{eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h2><p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{desc}</p></div>;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f3ea] text-slate-950 [scroll-behavior:smooth]">
      <header className="sticky top-0 z-50 border-b border-slate-900/10 bg-white/85 backdrop-blur-2xl" data-testid="home-header">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="店名片 home"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-lg font-black text-white shadow-lg shadow-teal-900/20">店</span><span className="truncate text-base font-black tracking-tight md:text-lg">店名片</span></Link>
          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 md:flex"><a href="#template-showcase" className="transition hover:text-teal-700">模板</a><a href="#hosting-plans" className="transition hover:text-teal-700">代管方案</a><a href="#faq" className="transition hover:text-teal-700">FAQ</a></nav>
          <OnboardingStartButton className="shrink-0 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-teal-700 md:px-5">開始建立店名片</OnboardingStartButton>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16" data-testid="home-hero">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,.24),transparent_32%),radial-gradient(circle_at_84%_10%,rgba(251,146,60,.24),transparent_30%),linear-gradient(180deg,#fffaf0,#f7f3ea)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div><span className="inline-flex rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-teal-700 shadow-sm">店名片｜小店家的 AI 名片式網頁產生器</span><h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-5xl md:text-7xl" data-testid="home-hero-title">30 分鐘建立你的店家線上名片</h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-650 md:text-xl md:leading-9">選模板、填資料、放菜單、加 LINE 與外送連結，一鍵產生可分享、可匯出、可代管的店家名片式網頁。</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><OnboardingStartButton /><a href="#hosting-plans" data-testid="home-hosting-plans" className="rounded-full bg-white px-7 py-4 text-center font-black text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-teal-300">查看代管方案</a></div><div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">{['3 個主要產業', '30 套 AI 模板', 'ZIP 自行匯出', '店名片代管入口'].map(item => <div key={item} className="rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-slate-900/5 backdrop-blur"><p className="text-sm font-black text-slate-900">{item}</p></div>)}</div></div>
          <div className="relative mx-auto w-full max-w-2xl" data-testid="home-hero-mockup"><div className="relative rounded-[2rem] border border-white/70 bg-white/75 p-3 shadow-2xl shadow-slate-900/15 backdrop-blur-xl md:rounded-[2.5rem] md:p-5"><div className="grid grid-cols-3 gap-2 rounded-[1.5rem] bg-slate-950 p-3 md:gap-3 md:p-4">{showcaseTemplates.slice(0, 9).map((template, index) => <div key={template.name} className={`relative overflow-hidden rounded-2xl ${index % 3 === 1 ? 'translate-y-4' : ''}`}><img src={template.image} alt={`${template.name} template artwork`} className="aspect-[4/5] h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-2 text-[10px] font-black text-white">{template.name}</div></div>)}</div><div className="absolute left-5 top-8 hidden w-[58%] rounded-[1.6rem] border border-white/70 bg-white/95 p-4 shadow-2xl md:block"><p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-700">店名片 Preview</p><h3 className="mt-2 text-xl font-black">日沐茶飲</h3><p className="mt-1 text-xs text-slate-600">菜單、LINE、地圖與 SEO 即時同步</p><div className="mt-4 grid grid-cols-3 gap-2">{['模板', '菜單', '代管'].map(item => <span key={item} className="rounded-xl bg-teal-50 px-2 py-3 text-center text-xs font-black text-slate-700 shadow-sm">{item}</span>)}</div></div><div className="absolute -right-1 bottom-7 w-28 rounded-[1.8rem] border-[6px] border-slate-950 bg-white p-1 shadow-2xl md:-right-5 md:w-36"><img src="/template-gallery-ai/cafe/cafe-white-dripper.png" alt="mobile preview mockup" className="h-48 w-full rounded-[1.25rem] object-cover md:h-60" /></div></div></div>
        </div>
      </section>

      <section id="template-showcase" className="scroll-mt-24 bg-slate-950 px-4 py-16 text-white md:px-8 md:py-24" data-testid="template-showcase"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.28em] text-teal-300">30 AI Templates</p><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">30 套 AI 視覺模板，直接套用成店名片</h2><p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">每套模板都包含品牌視覺、背景、商品卡、菜單列表與手機版排版，不只是換色。</p></div><Link href="/builder" className="w-fit rounded-full bg-white px-6 py-3 font-black text-slate-950 transition hover:-translate-y-0.5">進入 Builder 選模板</Link></div><div className="mt-10 grid grid-flow-col auto-cols-[72%] gap-4 overflow-x-auto pb-4 sm:auto-cols-[38%] lg:grid-flow-row lg:grid-cols-6 lg:overflow-visible">{showcaseTemplates.map(template => <article key={template.name} className="group overflow-hidden rounded-[1.6rem] bg-white/10 ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-white/15"><img src={template.image} alt={`${template.name} ${template.industry} AI 模板`} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" /><div className="p-4"><span className="rounded-full bg-teal-300/15 px-3 py-1 text-[11px] font-black text-teal-200">{template.industry}</span><h3 className="mt-3 text-lg font-black">{template.name}</h3></div></article>)}</div></div></section>

      <section className="px-4 py-16 md:px-8 md:py-24" data-testid="workflow-section"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Workflow" title="四步驟完成店家名片式網頁" desc="從導引、模板、資料到發布方式，流程為小店家設計。" /><div className="mt-12 grid gap-5 md:grid-cols-4">{workflow.map(item => <article key={item.step} className="rounded-[2rem] border border-white bg-white/80 p-7 shadow-xl shadow-slate-900/5"><span className="grid h-14 w-14 place-items-center rounded-3xl bg-slate-950 text-xl font-black text-white shadow-lg">{item.step}</span><h3 className="mt-6 text-2xl font-black">{item.title}</h3><p className="mt-3 leading-7 text-slate-600">{item.desc}</p></article>)}</div></div></section>

      <section id="hosting-plans" className="scroll-mt-24 bg-white px-4 py-16 md:px-8 md:py-24" data-testid="pricing-hosting-section"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Export or Hosting" title="自行匯出，或交給我們代管" desc="店名片不是金流或完整電商；它先幫店家把可分享、可搜尋、可放菜單與聯絡方式的線上名片做好。" /><div className="mt-12 grid gap-5 lg:grid-cols-3">{hostingPlans.map(plan => <article key={plan.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm"><h3 className="text-2xl font-black">{plan.title}</h3><p className="mt-2 min-h-12 text-sm font-bold leading-6 text-slate-600">{plan.audience}</p><p className="mt-5 rounded-2xl bg-white px-4 py-3 font-black text-teal-700 ring-1 ring-teal-100">{plan.price}</p><ul className="mt-5 grid gap-3">{plan.features.map(feature => <li key={feature} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">✓ {feature}</li>)}</ul>{plan.title !== '自行匯出' && <div className="mt-5"><HostingRequestButton className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-teal-700" /></div>}</article>)}</div></div></section>

      <section id="features" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24" data-testid="features-section"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Features" title="為小店家設計的店名片功能" desc="不是工程工具，而是讓小店用最少步驟建立正式品牌入口。" /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{['新手導引 Wizard', '推薦模板邏輯', '發布前檢查', '代管申請入口', '範例資料套用', 'JSON 備份', 'ZIP 靜態匯出', '手機 RWD 預覽'].map(feature => <article key={feature} className="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-900/5"><h3 className="text-lg font-black">{feature}</h3><p className="mt-2 text-sm leading-6 text-slate-600">店名片 v0.3.0 已納入產品化流程。</p></article>)}</div></div></section>

      <section id="faq" className="scroll-mt-24 bg-slate-950 px-4 py-16 text-white md:px-8 md:py-24" data-testid="faq-section"><div className="mx-auto max-w-4xl"><SectionHeading eyebrow="Help / FAQ" title="常見問題" desc="確認店名片適合你的使用方式。" /><div className="mt-10 grid gap-4">{faqs.map(([q, a]) => <article key={q} className="rounded-[1.6rem] bg-white/10 p-5 ring-1 ring-white/10"><h3 className="text-lg font-black">{q}</h3><p className="mt-2 leading-7 text-slate-300">{a}</p></article>)}</div></div></section>

      <section className="px-4 py-16 md:px-8 md:py-24" data-testid="final-cta"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.8rem] bg-gradient-to-br from-teal-600 via-slate-950 to-orange-500 p-8 text-white shadow-2xl shadow-slate-900/20 md:p-14"><div className="relative max-w-2xl"><h2 className="text-3xl font-black tracking-tight md:text-5xl">現在開始建立你的第一張店名片</h2><p className="mt-4 text-lg leading-8 text-white/80">先用導引流程建立，再替換成自己的店家資訊、圖片與菜單。</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><OnboardingStartButton className="rounded-full bg-white px-7 py-4 text-center font-black text-slate-950 transition hover:-translate-y-0.5" /><a href="#hosting-plans" className="rounded-full bg-white/10 px-7 py-4 text-center font-black text-white ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white/15">查看代管方案</a></div></div></div></section>

      <footer className="border-t border-slate-900/10 bg-white px-4 py-10 md:px-8" data-testid="home-footer"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 font-black text-white">店</span><b>店名片</b></div><p className="mt-2 text-sm text-slate-500">小店家的 AI 名片式網頁產生器 · v0.3.0</p></div><div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600"><Link href="/builder">開始建立店名片</Link><a href="#template-showcase">模板</a><a href="#hosting-plans">代管方案</a><a href="#faq">FAQ</a></div></div></footer>
    </main>
  );
}
