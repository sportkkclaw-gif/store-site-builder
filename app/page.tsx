import Link from 'next/link';

const showcaseTemplates = [
  { name: '抹茶日和', industry: '飲料店', image: '/template-gallery-ai/drink-shop/drink-matcha-hiyori.png' },
  { name: '珍珠霓光', industry: '飲料店', image: '/template-gallery-ai/drink-shop/drink-boba-neon.png' },
  { name: '果香樂園', industry: '飲料店', image: '/template-gallery-ai/drink-shop/drink-fruit-paradise.png' },
  { name: '金色晚宴', industry: '餐飲店', image: '/template-gallery-ai/restaurant/restaurant-golden-banquet.png' },
  { name: '鍋物暖居', industry: '餐飲店', image: '/template-gallery-ai/restaurant/restaurant-hotpot-home.png' },
  { name: '日曜食堂', industry: '餐飲店', image: '/template-gallery-ai/restaurant/restaurant-sunday-shokudo.png' },
  { name: '白瓷濾杯', industry: '咖啡廳', image: '/template-gallery-ai/cafe/cafe-white-dripper.png' },
  { name: '城市黑白', industry: '咖啡廳', image: '/template-gallery-ai/cafe/cafe-urban-monochrome.png' },
  { name: '日常一隅', industry: '咖啡廳', image: '/template-gallery-ai/cafe/cafe-daily-corner.png' },
];

const featureShowcase = [
  { title: '5 步自動導引', desc: '從產業、風格、基本資料到使用方式，第一次開站不再卡在空白頁。', icon: '🧭' },
  { title: '推薦模板自動化', desc: '依飲料店、餐飲店、咖啡廳、小吃與風格偏好，直接套用最適合模板。', icon: '🎯' },
  { title: '發布前檢查', desc: '匯出前先檢查店名、聯絡方式、菜單、SEO、圖片與手機預覽。', icon: '✅' },
];

const pricing = [
  { name: '自行匯出', price: '$0', desc: '適合已會上傳靜態網站的店家或內部測試。', items: ['ZIP 靜態網站匯出', 'siteData JSON 備份', '離線 index.html 可開啟'], cta: '開始免費建立' },
  { name: '店名片代管', price: '$299/月', desc: '適合想交給店名片處理部署與基本維護的小店。', items: ['代管發布申請 JSON', '上架前資料檢查', '基礎靜態主機代管'], cta: '申請代管發布', featured: true },
  { name: '企業定制', price: '聯絡報價', desc: '適合多分店、品牌活動頁或客製視覺需求。', items: ['版型與內容顧問', '多頁內容規劃', '後續功能另案評估'], cta: '聯絡我們' },
];

const faqs = [
  ['店名片會幫我直接上線嗎？', 'v0.3.0 先提供代管發布申請入口，下載 hosting-request.json 後由人工協助確認，不含自動後端。'],
  ['本輪有登入、資料庫或金流嗎？', '沒有。本輪只做導引、範例資料、發布檢查與代管申請入口，不新增登入、資料庫、金流或多專案管理。'],
  ['我可以自己匯出網站嗎？', '可以。你仍然可以下載 generated-site.zip，內含 index.html、assets、siteData.json 與 README.txt。'],
  ['發布前檢查會阻止匯出嗎？', '不會。即使顯示缺少資料，系統只提醒風險，不會強制阻擋 ZIP 匯出。'],
  ['手機版可以用嗎？', 'Builder 與 Wizard 以 390px 手機寬度為基準驗證，不應出現水平破版。'],
  ['內部技術名稱會改嗎？', '不會。對外產品品牌改為「店名片」，repo 與內部技術代號仍保留原專案名稱，避免破壞既有部署流程。'],
];

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-black uppercase tracking-[0.28em] text-teal-600">{eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h2><p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{desc}</p></div>;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f3ea] text-slate-950 [scroll-behavior:smooth]">
      <header className="sticky top-0 z-50 border-b border-slate-900/10 bg-white/85 backdrop-blur-2xl" data-testid="home-header">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="店名片 home">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-lg font-black text-white shadow-lg shadow-teal-900/20">店</span>
            <span className="truncate text-base font-black tracking-tight md:text-lg">店名片</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-teal-700">功能亮點</a>
            <a href="#pricing" className="transition hover:text-teal-700">代管方案</a>
            <a href="#faq" className="transition hover:text-teal-700">常見問題</a>
          </nav>
          <Link href="/builder?onboarding=1" data-testid="primary-onboarding-link" className="shrink-0 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-teal-700 md:px-5">開始導引</Link>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16" data-testid="home-hero">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,.24),transparent_32%),radial-gradient(circle_at_84%_10%,rgba(251,146,60,.24),transparent_30%),linear-gradient(180deg,#fffaf0,#f7f3ea)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-flex rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-teal-700 shadow-sm">店名片｜AI 名片式網頁產生器</span>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-5xl md:text-7xl" data-testid="home-hero-title">小店家的第一張 AI 網頁名片</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-650 md:text-xl md:leading-9">店名片把店家資料、菜單、聯絡方式與模板推薦整理成一個可發布的名片式網站；可自行匯出，也可送出代管發布申請。</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/builder?onboarding=1" data-testid="home-start-onboarding" className="rounded-full bg-teal-600 px-7 py-4 text-center font-black text-white shadow-2xl shadow-teal-700/25 transition hover:-translate-y-0.5 hover:bg-teal-700">開始 5 步導引</Link>
              <Link href="/builder" data-testid="home-open-builder" className="rounded-full bg-white px-7 py-4 text-center font-black text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-teal-300">直接進入 Builder</Link>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">{['5 步 Onboarding', '自動推薦模板', '發布前檢查', '代管申請入口'].map(item => <div key={item} className="rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-slate-900/5 backdrop-blur"><p className="text-sm font-black text-slate-900">{item}</p></div>)}</div>
          </div>
          <div className="relative mx-auto w-full max-w-2xl" data-testid="home-hero-mockup">
            <div className="relative rounded-[2rem] border border-white/70 bg-white/75 p-3 shadow-2xl shadow-slate-900/15 backdrop-blur-xl md:rounded-[2.5rem] md:p-5">
              <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] bg-slate-950 p-3 md:gap-3 md:p-4">{showcaseTemplates.map((template, index) => <div key={template.name} className={`relative overflow-hidden rounded-2xl ${index % 3 === 1 ? 'translate-y-4' : ''}`}><img src={template.image} alt={`${template.name} template artwork`} className="aspect-[4/5] h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-2 text-[10px] font-black text-white">{template.name}</div></div>)}</div>
              <div className="absolute left-5 top-8 hidden w-[58%] rounded-[1.6rem] border border-white/70 bg-white/95 p-4 shadow-2xl md:block"><p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-700">Onboarding Result</p><h3 className="mt-2 text-xl font-black">日沐茶飲</h3><p className="mt-1 text-xs text-slate-600">推薦模板：抹茶日和 · 發布檢查 92%</p><div className="mt-4 grid grid-cols-3 gap-2">{['資料', '模板', '代管'].map(item => <span key={item} className="rounded-xl bg-teal-50 px-2 py-3 text-center text-xs font-black text-teal-800 shadow-sm">{item}</span>)}</div></div>
              <div className="absolute -right-1 bottom-7 w-28 rounded-[1.8rem] border-[6px] border-slate-950 bg-white p-1 shadow-2xl md:-right-5 md:w-36"><img src="/template-gallery-ai/cafe/cafe-daily-corner.png" alt="mobile preview mockup" className="h-48 w-full rounded-[1.25rem] object-cover md:h-60" /></div>
              <div className="absolute -right-2 top-4 rounded-full bg-white px-3 py-2 text-[10px] font-black text-teal-700 shadow-xl md:right-3 md:top-6">AI Template</div>
              <div className="absolute bottom-4 left-4 rounded-full bg-slate-950 px-3 py-2 text-[10px] font-black text-white shadow-xl">Hosting Request</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24" data-testid="feature-showcase-section">
        <div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Feature Showcase" title="從空白頁到可發布，一次走完" desc="v0.3.0 聚焦起步導引、範例資料與代管入口，不新增登入、資料庫或金流。" /><div className="mt-12 grid gap-5 md:grid-cols-3">{featureShowcase.map(feature => <article key={feature.title} className="rounded-[2rem] bg-white p-7 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5"><div className="text-4xl">{feature.icon}</div><h3 className="mt-5 text-2xl font-black">{feature.title}</h3><p className="mt-3 leading-7 text-slate-600">{feature.desc}</p></article>)}</div></div>
      </section>

      <section id="template-showcase" className="scroll-mt-24 bg-slate-950 px-4 py-16 text-white md:px-8 md:py-24" data-testid="template-showcase">
        <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.28em] text-teal-300">Recommendations</p><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">依店家類型與風格推薦模板</h2><p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">飲料店、餐飲店、咖啡廳與小吃店都可以從導引流程自動取得第一推薦模板。</p></div><Link href="/builder?onboarding=1" className="w-fit rounded-full bg-white px-6 py-3 font-black text-slate-950 transition hover:-translate-y-0.5">開始推薦流程</Link></div><div className="mt-10 grid grid-flow-col auto-cols-[72%] gap-4 overflow-x-auto pb-4 sm:auto-cols-[38%] lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible">{showcaseTemplates.map(template => <article key={template.name} className="group overflow-hidden rounded-[1.6rem] bg-white/10 ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-white/15"><img src={template.image} alt={`${template.name} ${template.industry} AI 模板`} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" /><div className="p-4"><span className="rounded-full bg-teal-300/15 px-3 py-1 text-[11px] font-black text-teal-200">{template.industry}</span><h3 className="mt-3 text-lg font-black">{template.name}</h3></div></article>)}</div></div>
      </section>

      <section id="pricing" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24" data-testid="pricing-section">
        <div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Pricing / Hosting" title="自行匯出或申請店名片代管" desc="代管發布申請以 hosting-request.json 半自動流轉，本輪不建立後端、不收金流。" /><div className="mt-12 grid gap-5 lg:grid-cols-3">{pricing.map(plan => <article key={plan.name} className={`rounded-[2rem] p-7 shadow-xl ring-1 ${plan.featured ? 'bg-slate-950 text-white shadow-slate-900/20 ring-slate-950' : 'bg-white text-slate-950 shadow-slate-900/5 ring-slate-900/5'}`}><p className="text-sm font-black text-teal-500">{plan.name}</p><h3 className="mt-3 text-4xl font-black">{plan.price}</h3><p className={`mt-3 leading-7 ${plan.featured ? 'text-slate-300' : 'text-slate-600'}`}>{plan.desc}</p><ul className="mt-6 grid gap-3 text-sm font-bold">{plan.items.map(item => <li key={item}>✓ {item}</li>)}</ul><Link href="/builder?onboarding=1" className={`mt-7 inline-flex rounded-full px-5 py-3 font-black ${plan.featured ? 'bg-white text-slate-950' : 'bg-teal-600 text-white'}`}>{plan.cta}</Link></article>)}</div></div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-white px-4 py-16 md:px-8 md:py-24" data-testid="faq-section">
        <div className="mx-auto max-w-4xl"><SectionHeading eyebrow="FAQ" title="常見問題" desc="明確說明 v0.3.0 範圍，避免誤以為已包含後端、金流或正式雲端部署。" /><div className="mt-10 grid gap-3">{faqs.map(([q, a]) => <details key={q} className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200"><summary className="cursor-pointer text-lg font-black text-slate-950">{q}</summary><p className="mt-3 leading-7 text-slate-600">{a}</p></details>)}</div></div>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-24" data-testid="final-cta"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.8rem] bg-gradient-to-br from-teal-600 via-slate-950 to-orange-500 p-8 text-white shadow-2xl shadow-slate-900/20 md:p-14"><div className="relative max-w-2xl"><h2 className="text-3xl font-black tracking-tight md:text-5xl">現在建立你的店名片</h2><p className="mt-4 text-lg leading-8 text-white/80">先用範例資料完成 5 步導引，再替換成自己的店家資訊、圖片與菜單。</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/builder?onboarding=1" className="rounded-full bg-white px-7 py-4 text-center font-black text-slate-950 transition hover:-translate-y-0.5">開始 5 步導引</Link><Link href="/builder" className="rounded-full bg-white/10 px-7 py-4 text-center font-black text-white ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white/15">直接開啟 Builder</Link></div></div></div></section>

      <footer className="border-t border-slate-900/10 bg-white px-4 py-10 md:px-8" data-testid="home-footer"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 font-black text-white">店</span><b>店名片</b></div><p className="mt-2 text-sm text-slate-500">小店家的 AI 名片式網頁產生器 · v0.3.0</p></div><div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600"><Link href="/builder?onboarding=1">開始導引</Link><a href="#features">功能亮點</a><a href="#pricing">代管方案</a><a href="#faq">常見問題</a></div></div></footer>
    </main>
  );
}
