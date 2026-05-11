import Link from 'next/link';

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
  { step: '01', title: '填寫店家資料', desc: '輸入店名、品牌標語、營業時間、地址、電話與社群連結。' },
  { step: '02', title: '選擇 AI 模板', desc: '從飲料店、餐飲店、咖啡廳模板中選擇最適合的品牌風格。' },
  { step: '03', title: '預覽並匯出網站', desc: '即時查看桌機 / 手機版，匯出可離線開啟的靜態網站 ZIP。' },
];

const industries = [
  {
    title: '飲料店',
    desc: '手搖飲、茶飲、果茶、奶茶品牌，適合強調招牌飲品、外送連結與活動曝光。',
    hero: '/template-gallery-ai/drink-shop/drink-matcha-hiyori.png',
    templates: [
      { name: '抹茶日和', image: '/template-gallery-ai/drink-shop/drink-matcha-hiyori.png' },
      { name: '珍珠霓光', image: '/template-gallery-ai/drink-shop/drink-boba-neon.png' },
      { name: '果香樂園', image: '/template-gallery-ai/drink-shop/drink-fruit-paradise.png' },
    ],
  },
  {
    title: '餐飲店',
    desc: '餐廳、小食堂、火鍋、燒烤、早午餐，適合展示菜單、訂位、外帶與品牌故事。',
    hero: '/template-gallery-ai/restaurant/restaurant-golden-banquet.png',
    templates: [
      { name: '金色晚宴', image: '/template-gallery-ai/restaurant/restaurant-golden-banquet.png' },
      { name: '香辣市集', image: '/template-gallery-ai/restaurant/restaurant-spicy-market.png' },
      { name: '鍋物暖居', image: '/template-gallery-ai/restaurant/restaurant-hotpot-home.png' },
    ],
  },
  {
    title: '咖啡廳',
    desc: '精品咖啡、甜點咖啡、社區咖啡、文青空間，適合營造空間氛圍與生活品牌感。',
    hero: '/template-gallery-ai/cafe/cafe-white-dripper.png',
    templates: [
      { name: '白瓷濾杯', image: '/template-gallery-ai/cafe/cafe-white-dripper.png' },
      { name: '城市黑白', image: '/template-gallery-ai/cafe/cafe-urban-monochrome.png' },
      { name: '日常一隅', image: '/template-gallery-ai/cafe/cafe-daily-corner.png' },
    ],
  },
];

const features = [
  { icon: '✍️', title: '欄位式建站', desc: '不用懂設計或程式，只要填資料。' },
  { icon: '🎨', title: '30 套 AI 模板', desc: '依產業挑選風格，快速建立品牌感。' },
  { icon: '🍱', title: '菜單 / 商品管理', desc: '可管理分類、品項、價格與招牌商品。' },
  { icon: '🖼️', title: '圖片媒體庫', desc: '上傳 Logo、Hero、商品圖與店面照。' },
  { icon: '🔎', title: 'SEO 基本設定', desc: '可設定網站標題、描述與 OG 圖。' },
  { icon: '📦', title: 'ZIP 靜態網站匯出', desc: '匯出 index.html、assets、siteData.json，可部署到靜態主機。' },
  { icon: '📱', title: '手機 RWD', desc: '支援 390 / 375 / 320 手機預覽。' },
  { icon: '🖥️', title: '全螢幕預覽', desc: '可用真實桌機畫布檢查網站效果。' },
];

const targets = ['飲料店', '餐飲店', '咖啡廳', '小吃店', '甜點店', '個人工作室', '小型品牌'];

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{desc}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f3ea] text-slate-950 [scroll-behavior:smooth]">
      <header className="sticky top-0 z-50 border-b border-slate-900/10 bg-white/80 backdrop-blur-2xl" data-testid="home-header">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="StoreSite Builder home">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-lg font-black text-white shadow-lg shadow-teal-900/20">S</span>
            <span className="truncate text-base font-black tracking-tight md:text-lg">StoreSite Builder</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 md:flex">
            <a href="#template-showcase" className="transition hover:text-teal-700">模板方向</a>
            <a href="#features" className="transition hover:text-teal-700">功能特色</a>
            <a href="#targets" className="transition hover:text-teal-700">適合對象</a>
          </nav>
          <Link href="/builder" data-testid="primary-builder-link" className="shrink-0 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-teal-700 md:px-5">開啟 Builder</Link>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16" data-testid="home-hero">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,.24),transparent_32%),radial-gradient(circle_at_84%_10%,rgba(251,146,60,.24),transparent_30%),linear-gradient(180deg,#fffaf0,#f7f3ea)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-flex rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-teal-700 shadow-sm">AI TEMPLATE WEBSITE BUILDER</span>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-5xl md:text-7xl" data-testid="home-hero-title">30 分鐘建立小店家官方網站</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-650 md:text-xl md:leading-9">輸入店家資料、菜單、圖片與連結，選擇 AI 視覺模板，即時預覽並匯出可部署的靜態網站。</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/builder" data-testid="home-start-builder" className="rounded-full bg-teal-600 px-7 py-4 text-center font-black text-white shadow-2xl shadow-teal-700/25 transition hover:-translate-y-0.5 hover:bg-teal-700">開始建立網站</Link>
              <a href="#template-showcase" data-testid="home-browse-templates" className="rounded-full bg-white px-7 py-4 text-center font-black text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-teal-300">瀏覽 30 套模板</a>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['3 個產業', '30 套 AI 模板', '靜態網站 ZIP 匯出', '手機 RWD 預覽'].map((item) => (
                <div key={item} className="rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
                  <p className="text-sm font-black text-slate-900">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl" data-testid="home-hero-mockup">
            <div className="absolute -left-8 top-10 hidden h-52 w-52 rounded-full bg-teal-300/35 blur-3xl md:block" />
            <div className="absolute -right-8 bottom-10 hidden h-64 w-64 rounded-full bg-orange-300/30 blur-3xl md:block" />
            <div className="relative rounded-[2rem] border border-white/70 bg-white/75 p-3 shadow-2xl shadow-slate-900/15 backdrop-blur-xl md:rounded-[2.5rem] md:p-5">
              <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] bg-slate-950 p-3 md:gap-3 md:p-4">
                {showcaseTemplates.slice(0, 9).map((template, index) => (
                  <div key={template.name} className={`relative overflow-hidden rounded-2xl ${index % 3 === 1 ? 'translate-y-4' : ''}`}>
                    <img src={template.image} alt={`${template.name} template artwork`} className="aspect-[4/5] h-full w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-2 text-[10px] font-black text-white">{template.name}</div>
                  </div>
                ))}
              </div>
              <div className="absolute left-5 top-8 hidden w-[58%] rounded-[1.6rem] border border-white/70 bg-white/95 p-4 shadow-2xl md:block">
                <div className="mb-3 flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div>
                <div className="rounded-2xl bg-teal-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-700">Builder Preview</p>
                  <h3 className="mt-2 text-xl font-black">日沐茶飲</h3>
                  <p className="mt-1 text-xs text-slate-600">即時同步店名、菜單、連結與 SEO</p>
                  <div className="mt-4 grid grid-cols-3 gap-2">{['模板', '菜單', '媒體'].map((item) => <span key={item} className="rounded-xl bg-white px-2 py-3 text-center text-xs font-black text-slate-700 shadow-sm">{item}</span>)}</div>
                </div>
              </div>
              <div className="absolute -right-1 bottom-7 w-28 rounded-[1.8rem] border-[6px] border-slate-950 bg-white p-1 shadow-2xl md:-right-5 md:w-36">
                <img src="/template-gallery-ai/cafe/cafe-white-dripper.png" alt="mobile preview mockup" className="h-48 w-full rounded-[1.25rem] object-cover md:h-60" />
              </div>
              <div className="absolute -right-2 top-4 rounded-full bg-white px-3 py-2 text-[10px] font-black text-teal-700 shadow-xl md:right-3 md:top-6">30 AI Templates</div>
              <div className="absolute bottom-4 left-4 rounded-full bg-slate-950 px-3 py-2 text-[10px] font-black text-white shadow-xl">ZIP Export</div>
              <div className="absolute bottom-20 right-20 hidden rounded-full bg-orange-500 px-3 py-2 text-[10px] font-black text-white shadow-xl md:block">Live Preview</div>
            </div>
          </div>
        </div>
      </section>

      <section id="template-showcase" className="scroll-mt-24 bg-slate-950 px-4 py-16 text-white md:px-8 md:py-24" data-testid="template-showcase">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-300">30 AI Templates</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">30 套 AI 視覺模板，直接套用成品牌官網</h2>
              <p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">每套模板都包含品牌視覺、背景、商品卡、菜單列表與手機版排版，不只是換色。</p>
            </div>
            <Link href="/builder" className="w-fit rounded-full bg-white px-6 py-3 font-black text-slate-950 transition hover:-translate-y-0.5">進入 Builder 選模板</Link>
          </div>
          <div className="mt-10 grid grid-flow-col auto-cols-[72%] gap-4 overflow-x-auto pb-4 sm:auto-cols-[38%] lg:grid-flow-row lg:grid-cols-6 lg:overflow-visible">
            {showcaseTemplates.map((template) => (
              <article key={template.name} className="group overflow-hidden rounded-[1.6rem] bg-white/10 ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-white/15">
                <img src={template.image} alt={`${template.name} ${template.industry} AI 模板`} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-4">
                  <span className="rounded-full bg-teal-300/15 px-3 py-1 text-[11px] font-black text-teal-200">{template.industry}</span>
                  <h3 className="mt-3 text-lg font-black">{template.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-24" data-testid="workflow-section">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Workflow" title="三步驟完成小店官網" desc="從資料到模板再到匯出，流程為小店家設計，不需要從空白頁開始。" />
          <div className="relative mt-12 grid gap-5 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-16 hidden h-px bg-gradient-to-r from-teal-300 via-slate-300 to-orange-300 md:block" />
            {workflow.map((item) => (
              <article key={item.step} className="relative rounded-[2rem] border border-white bg-white/80 p-7 shadow-xl shadow-slate-900/5">
                <span className="grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-2xl font-black text-white shadow-lg">{item.step}</span>
                <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24" data-testid="industry-sections">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Industries" title="為三種小店打造的模板庫" desc="飲料店、餐飲店與咖啡廳各有自己的視覺語言，不再用單一通用模板硬套。" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {industries.map((industry) => (
              <article key={industry.title} className="overflow-hidden rounded-[2.2rem] bg-white shadow-xl shadow-slate-900/8 ring-1 ring-slate-900/5">
                <img src={industry.hero} alt={`${industry.title} 模板主視覺`} className="h-64 w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-black">{industry.title}</h3>
                  <p className="mt-3 min-h-24 leading-7 text-slate-600">{industry.desc}</p>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {industry.templates.map((template) => (
                      <div key={template.name}>
                        <img src={template.image} alt={template.name} className="aspect-square rounded-2xl object-cover" />
                        <p className="mt-2 text-xs font-black text-slate-700">{template.name}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/builder" className="mt-6 inline-flex rounded-full bg-teal-600 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700">進入 Builder 選模板</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:px-8 md:py-24" data-testid="builder-preview-section">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-600">Builder / Preview</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">從資料編輯到即時預覽，全部在同一個畫面完成</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">修改內容即時同步，支援桌機 / 手機預覽，可開啟全螢幕桌機預覽，localStorage 自動儲存。</p>
            <ul className="mt-6 grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-2">
              {['基本資料', '模板選擇', '菜單 / 商品', '圖片媒體', 'SEO 設定', '全螢幕預覽'].map((item) => <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">✓ {item}</li>)}
            </ul>
          </div>
          <div className="rounded-[2rem] bg-slate-950 p-3 shadow-2xl shadow-slate-900/20 md:p-5">
            <div className="grid gap-3 lg:grid-cols-[0.72fr_1fr]">
              <div className="rounded-[1.5rem] bg-white p-4">
                <div className="mb-4 h-3 w-24 rounded-full bg-teal-200" />
                {['店家名稱', '品牌標語', '模板風格', '菜單品項', '社群連結'].map((field) => <div key={field} className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-black text-slate-700">{field}</div>)}
              </div>
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f5efe5] p-4">
                <img src="/template-gallery-ai/restaurant/restaurant-golden-banquet.png" alt="desktop preview example" className="h-72 w-full rounded-[1.2rem] object-cover" />
                <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur">
                  <p className="text-xs font-black text-teal-700">Desktop Preview</p>
                  <h3 className="text-2xl font-black">金色晚宴</h3>
                </div>
                <div className="absolute right-5 top-5 rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white">全螢幕預覽</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24" data-testid="features-section">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Features" title="為小店家設計的建站功能" desc="不是工程工具，而是讓小店用最少步驟建立正式品牌官網的產品流程。" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="group rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/10">
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-4 text-lg font-black">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="export" className="scroll-mt-24 bg-slate-950 px-4 py-16 text-white md:px-8 md:py-24" data-testid="zip-export-section">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-300">ZIP Export</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">匯出後就是一個可部署的靜態網站</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">產生 index.html、assets、siteData.json 與 README，不依賴 Next.js runtime，可上傳到任何靜態主機。</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['無 localhost', '無 /_next 依賴', 'file:// 可開啟', '手機 RWD 通過'].map((item) => <span key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black ring-1 ring-white/10">✓ {item}</span>)}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-5 text-slate-950 shadow-2xl shadow-black/20">
            <div className="rounded-[1.5rem] bg-slate-50 p-5 font-mono text-sm leading-8 text-slate-700 ring-1 ring-slate-200">
              <p className="font-black text-slate-950">generated-site.zip</p>
              <p>├─ index.html</p>
              <p>├─ assets/</p>
              <p>├─ siteData.json</p>
              <p>└─ README.txt</p>
            </div>
          </div>
        </div>
      </section>

      <section id="targets" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24" data-testid="targets-section">
        <div className="mx-auto max-w-7xl rounded-[2.4rem] bg-white p-7 shadow-xl shadow-slate-900/5 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-600">For small brands</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">適合正在建立品牌官網的小店</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">如果你只有 Facebook、Instagram 或外送平台，StoreSite Builder 可以快速幫你建立一個看起來更正式的品牌官網。</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {targets.map((target) => <span key={target} className="rounded-full bg-teal-50 px-5 py-3 font-black text-teal-800 ring-1 ring-teal-100">{target}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-8 md:pb-24" data-testid="final-cta">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.8rem] bg-gradient-to-br from-teal-600 via-slate-950 to-orange-500 p-8 text-white shadow-2xl shadow-slate-900/20 md:p-14">
          <div className="absolute -right-10 -top-16 hidden rotate-6 grid-cols-3 gap-3 opacity-25 md:grid">
            {showcaseTemplates.slice(0, 6).map((template) => <img key={template.name} src={template.image} alt="" className="h-32 w-24 rounded-2xl object-cover" />)}
          </div>
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">現在開始建立你的第一個小店官網</h2>
            <p className="mt-4 text-lg leading-8 text-white/80">先用範例資料測試流程，再替換成自己的店家資訊、圖片與菜單。</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/builder" className="rounded-full bg-white px-7 py-4 text-center font-black text-slate-950 transition hover:-translate-y-0.5">開始建立網站</Link>
              <a href="#template-showcase" className="rounded-full bg-white/10 px-7 py-4 text-center font-black text-white ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white/15">瀏覽模板方向</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900/10 bg-white px-4 py-10 md:px-8" data-testid="home-footer">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 font-black text-white">S</span><b>StoreSite Builder</b></div>
            <p className="mt-2 text-sm text-slate-500">小店家 30 分鐘官網產生器 · v0.2.10</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600">
            <Link href="/builder">開始建立網站</Link>
            <a href="#template-showcase">模板方向</a>
            <a href="#features">功能特色</a>
            <a href="#export">匯出說明</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
